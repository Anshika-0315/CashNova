import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { BsWallet2, BsCalendar2Month, BsCalendar2, BsBarChart, BsPencilSquare, BsTrash, BsPlusCircle } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../api/apidata';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [groupedMonthlyBudgets, setGroupedMonthlyBudgets] = useState({});
    const [groupedAnnualBudgets, setGroupedAnnualBudgets] = useState({});
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        budget_type: 'MONTHLY',
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
    }, []);

    useEffect(() => {
        groupBudgets(budgets);
    }, [budgets]);

    const fetchBudgets = async () => {
        try {
            const response = await API.get('/api/budgets/');
            setBudgets(response.data.results);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            let allCategories = [];
            let url = '/api/categories/';
            while (url) {
                const response = await API.get(url);
                allCategories = allCategories.concat(response.data.results);
                url = response.data.next; // If next is null, loop ends
            }
            const expenseCategories = allCategories.filter(c => c.type === 'EXPENSE');
            setCategories(expenseCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const groupBudgets = (list) => {
        const monthly = {};
        const annual = {};

        list.forEach(b => {
            const key = b.month ? `${b.year}-${b.month}` : `${b.year}`;
            if (b.budget_type === 'MONTHLY') {
                if (!monthly[key]) monthly[key] = [];
                monthly[key].push(b);
            } else if (b.budget_type === 'ANNUAL') {
                if (!annual[key]) annual[key] = [];
                annual[key].push(b);
            }
        });

        const sortKeys = (obj) => {
            const sortedKeys = Object.keys(obj).sort((a, b) => {
                const [yearA, monthA = 0] = a.split('-').map(Number);
                const [yearB, monthB = 0] = b.split('-').map(Number);
                return yearB - yearA || monthB - monthA;
            });
            const sortedGrouped = {};
            sortedKeys.forEach(key => {
                sortedGrouped[key] = obj[key];
            });
            return sortedGrouped;
        };

        setGroupedMonthlyBudgets(sortKeys(monthly));
        setGroupedAnnualBudgets(sortKeys(annual));
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                month: formData.budget_type === "MONTHLY" ? formData.month : null,
            };

            if (editingBudget) {
                await API.put(`/api/budgets/${editingBudget.id}/`, payload);
            } else {
                await API.post('/api/budgets/', payload);
            }

            fetchBudgets();
            setShowModal(false);
            setEditingBudget(null);
            setError("");
            resetForm();
        } catch (error) {
            console.error('Error saving budget:', error);
            setError("Failed to save budget. Check for duplicates or invalid data.");
        }
    };

    const resetForm = () => {
        setFormData({
            budget_type: 'MONTHLY',
            category: '',
            amount: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        });
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setFormData({
            budget_type: budget.budget_type,
            category: budget.category,
            amount: budget.amount,
            month: budget.month || new Date().getMonth() + 1,
            year: budget.year
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await API.delete(`/api/budgets/${id}/`);
                fetchBudgets();
            } catch (error) {
                console.error('Error deleting budget:', error);
            }
        }
    };

    const formatMonthYear = (key) => {
        const [year, month] = key.split('-');
        return month ? `${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}` : `${year}`;
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === parseInt(id));
        return cat ? cat.name : '';
    };

    // --- Enhanced Card Styles ---
    const budgetCardStyle = {
        borderRadius: 18,
        boxShadow: "0 4px 24px 0 rgba(60,72,88,0.10)",
        border: "none",
        background: "linear-gradient(120deg, #f8fafc 80%, #e0e7ff 100%)",
        minHeight: 210,
        position: "relative"
    };

    const iconBg = {
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 2px 8px #e0e7ff",
        padding: 8,
        marginRight: 10,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
    };

    const renderBudgetGroups = (grouped, title) => (
        Object.keys(grouped).length === 0 ? (
            <Alert variant="info" className="my-4">No {title.toLowerCase()} budgets available.</Alert>
        ) : (
            Object.entries(grouped).map(([key, group]) => {
                const totalAmount = group.reduce((sum, b) => sum + parseFloat(b.amount), 0);
                return (
                    <div key={key} className="mb-4">
                        <Card className="shadow-sm mb-3" style={{ borderRadius: 16, border: "none", background: "#f3f4f6" }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-2">
                                    <div style={iconBg}>
                                        {title === "Monthly"
                                            ? <BsCalendar2Month style={{ color: "#6366f1", fontSize: 22 }} />
                                            : <BsCalendar2 style={{ color: "#6366f1", fontSize: 22 }} />}
                                    </div>
                                    <div>
                                        <h4 className="mb-0" style={{ color: "#6366f1", fontWeight: 700 }}>
                                            {formatMonthYear(key)}
                                        </h4>
                                        <div style={{ color: "#059669", fontWeight: 600, fontSize: 16 }}>
                                            <BsWallet2 style={{ marginRight: 8, marginBottom: 3 }} />
                                            Total Budgeted: ₹{totalAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <Row>
                                    {group.map((b) => (
                                        <Col md={6} lg={4} key={b.id} className="mb-3">
                                            <Card style={budgetCardStyle} className="shadow-sm h-100">
                                                <Card.Body>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div style={iconBg}>
                                                            <BsBarChart style={{ color: "#6366f1", fontSize: 22 }} />
                                                        </div>
                                                        <Card.Title style={{ fontWeight: 600, color: "#312e81", marginBottom: 0 }}>
                                                            {getCategoryName(b.category)}
                                                        </Card.Title>
                                                    </div>
                                                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                                        {b.budget_type === "MONTHLY"
                                                            ? <BsCalendar2Month style={{ marginRight: 4 }} />
                                                            : <BsCalendar2 style={{ marginRight: 4 }} />}
                                                        {b.budget_type} Budget - {b.year}{b.month ? `/${b.month}` : ""}
                                                    </Card.Subtitle>
                                                    <div className="mb-2" style={{ fontSize: 15 }}>
                                                        <strong>Amount:</strong> <span style={{ color: "#059669" }}>₹{b.amount}</span>
                                                    </div>
                                                    <div className="mb-2" style={{ fontSize: 15 }}>
                                                        <strong>Remaining:</strong> <span style={{ color: "#f59e42" }}>₹{b.remaining_budget}</span>
                                                    </div>
                                                    <ProgressBar
                                                        now={b.budget_progress_percentage}
                                                        label={`${parseFloat(b.budget_progress_percentage).toFixed(2)}%`}
                                                        variant={b.budget_progress_percentage > 90 ? "danger" : "success"}
                                                        style={{ height: 18, borderRadius: 10, fontWeight: 600, fontSize: 14, background: "#e0e7ff" }}
                                                    />
                                                    <div className="d-flex justify-content-end gap-2 mt-3">
                                                        <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(b)}>
                                                            <BsPencilSquare />
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(b.id)}>
                                                            <BsTrash />
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                );
            })
        )
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)"
            }}
        >
            <div className="container py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <BsWallet2 style={{ fontSize: 32, color: "#6366f1" }} />
                        <h2 style={{ fontWeight: 700, color: "#312e81", marginBottom: 0, letterSpacing: "-1px" }}>
                            My Budgets
                        </h2>
                    </div>
                    <Button
                        variant="primary"
                        style={{
                            borderRadius: 20,
                            fontWeight: 600,
                            fontSize: 18,
                            padding: "8px 22px",
                            boxShadow: "0 2px 8px #6366f133"
                        }}
                        onClick={() => { resetForm(); setShowModal(true); }}
                    >
                        <BsPlusCircle style={{ fontSize: 22, marginRight: 8, marginBottom: 3 }} />
                        Set Budget
                    </Button>
                </div>

                {/* Super Card for Monthly Budgets */}
                <Card className="mb-5 shadow-lg" style={{
                    borderRadius: 24,
                    background: "linear-gradient(120deg, #e0f2fe 70%, #f0f4f9 100%)",
                    border: "none",
                    boxShadow: "0 8px 32px #38bdf855"
                }}>
                    <Card.Body>
                        <div className="d-flex align-items-center mb-4">
                            <div style={{
                                borderRadius: "50%",
                                background: "#fff",
                                boxShadow: "0 2px 8px #bae6fd",
                                padding: 12,
                                marginRight: 16,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <BsCalendar2Month style={{ color: "#0ea5e9", fontSize: 32 }} />
                            </div>
                            <div>
                                <h3 className="mb-0" style={{ color: "#0ea5e9", fontWeight: 700, letterSpacing: "-0.5px" }}>
                                    Monthly Budgets
                                </h3>
                                <div style={{ color: "#0369a1", fontWeight: 500, fontSize: 16 }}>
                                    Track your monthly spending goals by category.
                                </div>
                            </div>
                        </div>
                        {Object.keys(groupedMonthlyBudgets).length === 0 ? (
                            <Alert variant="info" className="my-4">No monthly budgets available.</Alert>
                        ) : (
                            Object.entries(groupedMonthlyBudgets).map(([key, group]) => {
                                const totalAmount = group.reduce((sum, b) => sum + parseFloat(b.amount), 0);
                                return (
                                    <Card key={key} className="mb-4 shadow-sm" style={{ borderRadius: 18, border: "none", background: "#f8fafc" }}>
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-2">
                                                <BsCalendar2Month style={{ color: "#6366f1", fontSize: 22, marginRight: 10 }} />
                                                <h4 className="mb-0" style={{ color: "#6366f1", fontWeight: 700 }}>
                                                    {formatMonthYear(key)}
                                                </h4>
                                                <div className="ms-auto" style={{ color: "#059669", fontWeight: 600, fontSize: 16 }}>
                                                    <BsWallet2 style={{ marginRight: 8, marginBottom: 3 }} />
                                                    Total: ₹{totalAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <Row>
                                                {group.map((b) => (
                                                    <Col md={6} lg={4} key={b.id} className="mb-3">
                                                        <Card style={{
                                                            borderRadius: 16,
                                                            boxShadow: "0 2px 12px #bae6fd55",
                                                            border: "none",
                                                            background: "#fff"
                                                        }} className="h-100">
                                                            <Card.Body>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <div style={{
                                                                        borderRadius: "50%",
                                                                        background: "#e0f2fe",
                                                                        boxShadow: "0 2px 8px #e0e7ff",
                                                                        padding: 8,
                                                                        marginRight: 10,
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }}>
                                                                        <BsBarChart style={{ color: "#0ea5e9", fontSize: 22 }} />
                                                                    </div>
                                                                    <Card.Title style={{ fontWeight: 600, color: "#312e81", marginBottom: 0 }}>
                                                                        {getCategoryName(b.category)}
                                                                    </Card.Title>
                                                                </div>
                                                                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                                                    <BsCalendar2Month style={{ marginRight: 4 }} />
                                                                    {b.budget_type} Budget - {b.year}/{b.month}
                                                                </Card.Subtitle>
                                                                <div className="mb-2" style={{ fontSize: 15 }}>
                                                                    <strong>Amount:</strong> <span style={{ color: "#059669" }}>₹{b.amount}</span>
                                                                </div>
                                                                <div className="mb-2" style={{ fontSize: 15 }}>
                                                                    <strong>Remaining:</strong> <span style={{ color: "#f59e42" }}>₹{b.remaining_budget}</span>
                                                                </div>
                                                                <ProgressBar
                                                                    now={b.budget_progress_percentage}
                                                                    label={`${parseFloat(b.budget_progress_percentage).toFixed(2)}%`}
                                                                    variant={b.budget_progress_percentage > 90 ? "danger" : "success"}
                                                                    style={{ height: 16, borderRadius: 10, fontWeight: 600, fontSize: 13, background: "#e0e7ff" }}
                                                                />
                                                                <div className="d-flex justify-content-end gap-2 mt-3">
                                                                    <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(b)}>
                                                                        <BsPencilSquare />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(b.id)}>
                                                                        <BsTrash />
                                                                    </Button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                );
                            })
                        )}
                    </Card.Body>
                </Card>

                {/* Super Card for Annual Budgets */}
                <Card className="mb-5 shadow-lg" style={{
                    borderRadius: 24,
                    background: "linear-gradient(120deg, #ede9fe 70%, #f0f4f9 100%)",
                    border: "none",
                    boxShadow: "0 8px 32px #a5b4fc55"
                }}>
                    <Card.Body>
                        <div className="d-flex align-items-center mb-4">
                            <div style={{
                                borderRadius: "50%",
                                background: "#fff",
                                boxShadow: "0 2px 8px #c7d2fe",
                                padding: 12,
                                marginRight: 16,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <BsCalendar2 style={{ color: "#6366f1", fontSize: 32 }} />
                            </div>
                            <div>
                                <h3 className="mb-0" style={{ color: "#6366f1", fontWeight: 700, letterSpacing: "-0.5px" }}>
                                    Annual Budgets
                                </h3>
                                <div style={{ color: "#3730a3", fontWeight: 500, fontSize: 16 }}>
                                    Plan your yearly spending for each category.
                                </div>
                            </div>
                        </div>
                        {Object.keys(groupedAnnualBudgets).length === 0 ? (
                            <Alert variant="info" className="my-4">No annual budgets available.</Alert>
                        ) : (
                            Object.entries(groupedAnnualBudgets).map(([key, group]) => {
                                const totalAmount = group.reduce((sum, b) => sum + parseFloat(b.amount), 0);
                                return (
                                    <Card key={key} className="mb-4 shadow-sm" style={{ borderRadius: 18, border: "none", background: "#f8fafc" }}>
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-2">
                                                <BsCalendar2 style={{ color: "#6366f1", fontSize: 22, marginRight: 10 }} />
                                                <h4 className="mb-0" style={{ color: "#6366f1", fontWeight: 700 }}>
                                                    {formatMonthYear(key)}
                                                </h4>
                                                <div className="ms-auto" style={{ color: "#059669", fontWeight: 600, fontSize: 16 }}>
                                                    <BsWallet2 style={{ marginRight: 8, marginBottom: 3 }} />
                                                    Total: ₹{totalAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <Row>
                                                {group.map((b) => (
                                                    <Col md={6} lg={4} key={b.id} className="mb-3">
                                                        <Card style={{
                                                            borderRadius: 16,
                                                            boxShadow: "0 2px 12px #a5b4fc55",
                                                            border: "none",
                                                            background: "#fff"
                                                        }} className="h-100">
                                                            <Card.Body>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <div style={{
                                                                        borderRadius: "50%",
                                                                        background: "#ede9fe",
                                                                        boxShadow: "0 2px 8px #e0e7ff",
                                                                        padding: 8,
                                                                        marginRight: 10,
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }}>
                                                                        <BsBarChart style={{ color: "#6366f1", fontSize: 22 }} />
                                                                    </div>
                                                                    <Card.Title style={{ fontWeight: 600, color: "#312e81", marginBottom: 0 }}>
                                                                        {getCategoryName(b.category)}
                                                                    </Card.Title>
                                                                </div>
                                                                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                                                    <BsCalendar2 style={{ marginRight: 4 }} />
                                                                    {b.budget_type} Budget - {b.year}
                                                                </Card.Subtitle>
                                                                <div className="mb-2" style={{ fontSize: 15 }}>
                                                                    <strong>Amount:</strong> <span style={{ color: "#059669" }}>₹{b.amount}</span>
                                                                </div>
                                                                <div className="mb-2" style={{ fontSize: 15 }}>
                                                                    <strong>Remaining:</strong> <span style={{ color: "#f59e42" }}>₹{b.remaining_budget}</span>
                                                                </div>
                                                                <ProgressBar
                                                                    now={b.budget_progress_percentage}
                                                                    label={`${parseFloat(b.budget_progress_percentage).toFixed(2)}%`}
                                                                    variant={b.budget_progress_percentage > 90 ? "danger" : "success"}
                                                                    style={{ height: 16, borderRadius: 10, fontWeight: 600, fontSize: 13, background: "#e0e7ff" }}
                                                                />
                                                                <div className="d-flex justify-content-end gap-2 mt-3">
                                                                    <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(b)}>
                                                                        <BsPencilSquare />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(b.id)}>
                                                                        <BsTrash />
                                                                    </Button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                );
                            })
                        )}
                    </Card.Body>
                </Card>

                <Modal show={showModal} onHide={() => { setShowModal(false); setEditingBudget(null); }}>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <BsWallet2 style={{ marginRight: 8, color: "#6366f1" }} />
                                {editingBudget ? 'Edit Budget' : 'Set New Budget'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <BsBarChart style={{ marginRight: 6, color: "#6366f1" }} />
                                    Category
                                </Form.Label>
                                <Form.Select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ maxHeight: 200, overflowY: 'auto' }}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <BsWallet2 style={{ marginRight: 6, color: "#059669" }} />
                                    Amount
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    required
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <BsCalendar2 style={{ marginRight: 6, color: "#6366f1" }} />
                                    Budget Type
                                </Form.Label>
                                <Form.Select
                                    name="budget_type"
                                    value={formData.budget_type}
                                    onChange={handleChange}
                                >
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="ANNUAL">Annual</option>
                                </Form.Select>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <BsCalendar2 style={{ marginRight: 6, color: "#6366f1" }} />
                                            Year
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {formData.budget_type === "MONTHLY" && (
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <BsCalendar2Month style={{ marginRight: 6, color: "#6366f1" }} />
                                                Month
                                            </Form.Label>
                                            <Form.Select
                                                name="month"
                                                value={formData.month}
                                                onChange={handleChange}
                                                style={{ maxHeight: 200, overflowY: 'auto' }}
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingBudget(null); }}>Cancel</Button>
                            <Button type="submit" variant="success">{editingBudget ? 'Update' : 'Save'} Budget</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Budgets;
