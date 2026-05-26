import React, { useEffect, useState } from 'react';
import {
  Badge, Button, Form, Modal, Row, Col, InputGroup, Alert, Card
} from 'react-bootstrap';
import API from '../api/apidata';
import { 
  BsPlusCircle, BsPencilSquare, BsTrash, BsArrowDownCircle, BsArrowUpCircle, 
  BsSearch, BsWallet2, BsPiggyBank, BsBoxArrowDown, BsCalendar2Month 
} from "react-icons/bs";

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    transaction_type: 'EXPENSE',
    date: '',
  });
  const [categories, setCategories] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const fetchBudgetCategories = async () => {
    try {
      const res = await API.get('/api/budgets/');
      const budgetCategoryIds = res.data.results.map(b => b.category);
      setBudgetCategories([...new Set(budgetCategoryIds)]);
    } catch (err) {
      console.error('Failed to fetch budget categories:', err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      let allCategories = [];
      let url = '/api/categories/';
      while (url) {
        const res = await API.get(url);
        allCategories = allCategories.concat(Array.isArray(res.data.results) ? res.data.results : res.data);
        url = res.data.next; // If next is null, loop ends
      }
      setAllCategories(allCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filterCategories = () => {
    const filtered = allCategories.filter(cat =>
      cat.type === 'INCOME' ||
      budgetCategories.includes(cat.id) ||
      cat.name === "Goal Savings"
    );
    setCategories(filtered);
  };

  const fetchTransactions = async () => {
    try {
      let url = '/api/transactions/';
      const params = [];

      if (yearFilter) params.push(`year=${yearFilter}`);
      if (monthFilter) params.push(`month=${monthFilter}`);
      params.push('page=1'); // Start from page 1

      let fullUrl = url + (params.length ? `?${params.join('&')}` : '');
      let allResults = [];
      let nextUrl = fullUrl;

      while (nextUrl) {
        const res = await API.get(nextUrl);
        const data = res.data;
        allResults = allResults.concat(data.results || []);
        nextUrl = data.next;
      }

      const sorted = [...allResults].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBudgetCategories();
      await fetchAllCategories();
      fetchTransactions();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allCategories.length > 0) {
      filterCategories();
    }
  }, [budgetCategories, allCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [monthFilter, yearFilter]);

  const matchesSearch = (txn) => {
    const query = search.toLowerCase();
    const date = new Date(txn.date);
    return (
      txn.description?.toLowerCase().includes(query) ||
      txn.category_name?.toLowerCase().includes(query) ||
      date.toLocaleString('default', { month: 'long' }).toLowerCase().includes(query) ||
      date.getFullYear().toString().includes(query)
    );
  };

  const filteredTransactions = search.trim()
    ? transactions.filter(matchesSearch)
    : transactions;

  const totalIncome = filteredTransactions
    .filter((t) => t.transaction_type === 'INCOME')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.transaction_type === 'EXPENSE')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await API.delete(`/api/transactions/${id}/`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const openEditModal = (txn) => {
    setFormData({
      amount: txn.amount,
      description: txn.description,
      category: txn.category,
      transaction_type: txn.transaction_type,
      date: txn.date,
    });
    setEditingId(txn.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editMode) {
        await API.put(`/api/transactions/${editingId}/`, payload);
      } else {
        await API.post('/api/transactions/', payload);
      }
      setFormData({
        amount: '',
        description: '',
        category: '',
        transaction_type: 'EXPENSE',
        date: '',
      });
      setEditMode(false);
      setShowModal(false);
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to submit transaction:', err);
    }
  };

  // --- UI ENHANCEMENTS BELOW ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f9 0%, #e0e7ff 100%)"
      }}
    >
      <div className="container py-4">
        {/* Centered Heading with Custom Rupee & Arrows Logo */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="d-flex align-items-center gap-3 mb-2">
            {/* Custom SVG: Rupee symbol with green and red arrows */}
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                {/* Rupee Symbol */}
                <circle cx="24" cy="24" r="14" fill="#fffde7" stroke="#ffe082" strokeWidth="2"/>
                <text x="24" y="30" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#f9a825" fontFamily="Segoe UI, Arial">&#8377;</text>
                {/* Green Arrow (down/right) */}
                <path d="M34 14 A14 14 0 0 1 24 38" stroke="#34d399" strokeWidth="3" fill="none" />
                <polygon points="34,14 33,17 36,16" fill="#34d399"/>
                {/* Red Arrow (up/left) */}
                <path d="M14 34 A14 14 0 0 1 24 10" stroke="#f87171" strokeWidth="3" fill="none" />
                <polygon points="14,34 17,33 16,36" fill="#f87171"/>
              </svg>
            </span>
            <h1
              style={{
                fontWeight: 800,
                color: "#4338ca",
                marginBottom: 0,
                letterSpacing: "-1.5px",
                fontSize: "2.3rem",
                lineHeight: 1.1,
              }}
            >
              My Transactions
            </h1>
          </div>
        </div>

        {/* Filters and Actions Row */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: 18 }}>
          <div className="d-flex align-items-center flex-wrap" style={{ gap: 14 }}>
            <Form.Select
              size="sm"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              style={{
                minWidth: 140,
                maxWidth: 160,
                borderRadius: 16,
                background: "#f8fafc",
                border: "1.5px solid #e0e7ff",
                fontWeight: 500,
                color: "#6366f1",
                boxShadow: "0 2px 8px #e0e7ff33"
              }}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              size="sm"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{
                minWidth: 110,
                maxWidth: 140,
                borderRadius: 16,
                background: "#f8fafc",
                border: "1.5px solid #e0e7ff",
                fontWeight: 500,
                color: "#6366f1",
                boxShadow: "0 2px 8px #e0e7ff33"
              }}
            >
              <option value="">All Years</option>
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </Form.Select>
            <InputGroup size="sm" style={{
              minWidth: 220,
              maxWidth: 260,
              borderRadius: 16,
              background: "#f8fafc",
              border: "1.5px solid #e0e7ff",
              boxShadow: "0 2px 8px #e0e7ff33"
            }}>
              <InputGroup.Text style={{
                background: "#f8fafc",
                border: "none",
                color: "#6366f1",
                fontWeight: 600
              }}>
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  borderRadius: "0 16px 16px 0",
                  background: "#f8fafc",
                  border: "none",
                  fontWeight: 500,
                  color: "#6366f1"
                }}
              />
            </InputGroup>
          </div>
          <Button
            variant="primary"
            size="sm"
            style={{
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 16,
              padding: "7px 28px",
              boxShadow: "0 2px 8px #6366f133",
              whiteSpace: "nowrap",
              letterSpacing: "0.5px"
            }}
            onClick={() => {
              setShowModal(true);
              setEditMode(false);
              setFormData({
                amount: '',
                description: '',
                category: '',
                transaction_type: 'EXPENSE',
                date: '',
              });
            }}
          >
            <BsPlusCircle style={{ fontSize: 19, marginRight: 7, marginBottom: 2 }} />
            Add
          </Button>
        </div>

        {/* Summary Cards */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card
              className="shadow-sm summary-card"
              style={{
                borderRadius: 16,
                background: "#e0f7fa",
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 32px #38bdf855";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body className="text-center">
                <BsWallet2 style={{ fontSize: 38, color: "#059669", marginBottom: 6 }} />
                <h5 className="mt-2 mb-1" style={{ color: "#059669", fontWeight: 700 }}>Total Income</h5>
                <div className="fs-5 fw-bold text-success">₹{totalIncome}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="shadow-sm summary-card"
              style={{
                borderRadius: 16,
                background: "#ffe4e6",
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 32px #fb718555";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body className="text-center">
                <BsBoxArrowDown style={{ fontSize: 38, color: "#e11d48", marginBottom: 6 }} />
                <h5 className="mt-2 mb-1" style={{ color: "#e11d48", fontWeight: 700 }}>Total Expenses</h5>
                <div className="fs-5 fw-bold text-danger">₹{totalExpense}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="shadow-sm summary-card"
              style={{
                borderRadius: 16,
                background: "#ede9fe",
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 32px #6366f155";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body className="text-center">
                <BsPiggyBank style={{ fontSize: 38, color: "#6366f1", marginBottom: 6 }} />
                <h5 className="mt-2 mb-1" style={{ color: "#6366f1", fontWeight: 700 }}>Balance</h5>
                <div className="fs-5 fw-bold " style={{ color: "#6366f1"}} >₹{(totalIncome - totalExpense)}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Alert variant="info" className="text-center mt-4">No transactions found.</Alert>
        ) : (
          <div className="list-group shadow-sm mb-4">
            {filteredTransactions.map(t => (
              <div
                key={t.id}
                className="list-group-item list-group-item-action d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-2"
                style={{
                  borderRadius: 14,
                  background: t.transaction_type === 'INCOME'
                    ? "linear-gradient(90deg, #f0fbfc 80%, #f7fefd 100%)"
                    : "linear-gradient(90deg, #fff6f7 80%, #fdf7fa 100%)",
                  border: "none",
                  boxShadow: "0 2px 8px #e0e7ff33",
                  padding: "1rem 1.2rem"
                }}
              >
                <div className="d-flex align-items-center mb-2 mb-md-0 gap-3 flex-grow-1">
                  <div
                    style={{
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 2px 8px #e0e7ff",
                      padding: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {t.transaction_type === 'INCOME'
                      ? <BsArrowUpCircle style={{ color: "#7dd3fc", fontSize: 22 }} />
                      : <BsArrowDownCircle style={{ color: "#fca5a5", fontSize: 22 }} />}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: t.transaction_type === 'INCOME' ? "#38bdf8" : "#fb7185",
                      fontSize: "1.08rem"
                    }}>
                      {t.description?.includes("Saved for goal") && <span role="img" aria-label="goal">🎯 </span>}
                      {t.description || 'No Description'}
                    </div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {formatDate(t.date)}
                    </div>
                    <div className="mt-1">
                      <Badge bg="secondary" className="me-2">{t.category_name || 'Uncategorized'}</Badge>
                      <Badge bg={t.transaction_type === 'INCOME' ? 'info' : 'light'} text={t.transaction_type === 'INCOME' ? 'dark' : 'danger'}>
                        {t.transaction_type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <span className={t.transaction_type === 'INCOME' ? 'text-info' : 'text-danger'} style={{ fontWeight: 700, fontSize: 18 }}>
                    {t.transaction_type === 'INCOME' ? '+' : '-'}₹{t.amount}
                  </span>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openEditModal(t)}
                      style={{ borderRadius: 12, fontWeight: 600 }}
                      title="Edit"
                    >
                      <BsPencilSquare />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                      style={{ borderRadius: 12, fontWeight: 600 }}
                      title="Delete"
                    >
                      <BsTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Form onSubmit={handleAddOrEdit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editMode ? (
                  <>
                    <BsPencilSquare style={{ color: "#6366f1", marginRight: 8, marginBottom: 3 }} />
                    Edit Transaction
                  </>
                ) : (
                  <>
                    <BsPlusCircle style={{ color: "#059669", marginRight: 8, marginBottom: 3 }} />
                    Add Transaction
                  </>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-2">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>
                    <BsWallet2 style={{ marginRight: 6, color: "#6366f1" }} />
                    Amount
                  </Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    style={{ borderRadius: 12, fontSize: 16, background: "#f8fafc" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>
                    <BsSearch style={{ marginRight: 6, color: "#6366f1" }} />
                    Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description"
                    maxLength={100}
                    style={{ borderRadius: 12, fontSize: 16, background: "#f8fafc" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>
                    <BsBoxArrowDown style={{ marginRight: 6, color: "#6366f1" }} />
                    Category
                  </Form.Label>
                  <Form.Select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ maxHeight: 200, overflowY: 'auto', borderRadius: 12, fontSize: 16, background: "#f8fafc" }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>
                        {formData.transaction_type === "INCOME"
                          ? <BsArrowUpCircle style={{ marginRight: 6, color: "#059669" }} />
                          : <BsArrowDownCircle style={{ marginRight: 6, color: "#e11d48" }} />
                        }
                        Type
                      </Form.Label>
                      <Form.Select
                        value={formData.transaction_type}
                        onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                        style={{ borderRadius: 12, fontSize: 16, background: "#f8fafc" }}
                      >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>
                        <BsCalendar2Month style={{ marginRight: 6, color: "#6366f1" }} />
                        Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        style={{ borderRadius: 12, fontSize: 16, background: "#f8fafc" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 12 }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" style={{ borderRadius: 12, fontWeight: 600 }}>
                {editMode ? (
                  <>
                    <BsPencilSquare style={{ marginRight: 5, marginBottom: 2 }} />
                    Update
                  </>
                ) : (
                  <>
                    <BsPlusCircle style={{ marginRight: 5, marginBottom: 2 }} />
                    Add
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Transactions;
