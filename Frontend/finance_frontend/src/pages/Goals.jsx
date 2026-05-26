import React, { useState, useEffect } from 'react';
import API from '../api/apidata';
import {
  Card, Button, Form, Modal, Table, Badge, ProgressBar,
  Dropdown, ButtonGroup, OverlayTrigger, Tooltip, Row, Col
} from 'react-bootstrap';
import Confetti from 'react-confetti';
import { BsBullseye, BsCheckCircle, BsXCircle, BsClock, BsCalendar2, BsPiggyBank, BsBarChart, BsPencilSquare, BsTrash, BsPlusCircle, BsClockHistory } from "react-icons/bs";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', target_amount: '', target_date: '' });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const [historyGoal, setHistoryGoal] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [goalStatus, setGoalStatus] = useState({ completed: [], missed: [] });

  const fetchGoals = async () => {
    const res = await API.get('/api/goals/');
    setGoals(res.data.results || res.data);
  };

  const fetchGoalStatus = async () => {
    const res = await API.get('/api/goals/check_status/');
    const { completed = [], missed = [] } = res.data;
    setGoalStatus({ completed, missed });
  };

  useEffect(() => {
    fetchGoals();
    fetchGoalStatus();
  }, []);

  const handlePopupClose = () => {
    setShowStatusModal(false);
    setConfettiTrigger(false);
  };

  const fetchHistory = async (goal) => {
    const res = await API.get(`/api/goals/${goal.id}/history/`);
    setHistoryData(res.data);
    setHistoryGoal(goal);
    setShowHistoryModal(true);
  };

  const getProgressVariant = (percentage) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 40) return 'warning';
    return 'danger';
  };

  const handleSubmit = async () => {
    const payload = { ...formData, target_amount: parseFloat(formData.target_amount) };
    if (editMode) {
      await API.put(`/api/goals/${editingId}/`, payload);
    } else {
      await API.post('/api/goals/', payload);
    }
    await fetchGoals(); // Ensure this is awaited
    setShowForm(false);
    setEditMode(false);
    setEditingId(null);
    setFormData({ name: '', target_amount: '', target_date: '' });
  };

  const editGoal = (g) => {
    setFormData({ name: g.name, target_amount: g.target_amount, target_date: g.target_date });
    setEditingId(g.id);
    setEditMode(true);
    setShowForm(true);
  };

  const deleteGoal = async (id) => {
    if (window.confirm("Delete this goal?")) {
      await API.delete(`/api/goals/${id}/`);
      await fetchGoals();
    }
  };

  const contribute = async (id) => {
    const amt = prompt('Enter contribution amount:');
    if (amt) {
      await API.post(`/api/goals/${id}/contribute/`, {
        amount: parseFloat(amt),
        date: new Date().toISOString().split('T')[0]
      });
      await fetchGoals();
    }
  };

  // Inline categorization to always use latest goals state
  const today = new Date();
  const completed = goals.filter(goal => goal.saved_amount >= goal.target_amount);
  const missed = goals.filter(goal => goal.saved_amount < goal.target_amount && new Date(goal.target_date) < today);
  const ongoing = goals.filter(goal => goal.saved_amount < goal.target_amount && new Date(goal.target_date) >= today);

  const onGoalClick = (g, type) => {
    const isCompleted = goalStatus.completed.includes(g.name);
    const isMissed = goalStatus.missed.includes(g.name);

    if (isCompleted || isMissed) {
      const text = `${isCompleted ? '🎉 Completed: ' + g.name : ''}${isMissed ? '😞 Missed: ' + g.name : ''}`;
      setStatusMsg(text);
      setConfettiTrigger(isCompleted); // Only trigger confetti for completed
      setShowStatusModal(true);
    }
  };

  const renderGoalRow = (g, type, showDailySaving = true, showRemaining = true, showCompletedOn = false) => {
    const percent = (g.saved_amount / g.target_amount) * 100;
    const actions = type === 'ongoing';
    const remaining = Math.max(0, g.target_amount - g.saved_amount);

    // Calculate completed date if needed
    let completedOn = '';
    if (showCompletedOn && g.completed_on) {
      completedOn = g.completed_on;
    }

    return (
      <tr key={g.id} onClick={() => {
        if (type !== 'ongoing') onGoalClick(g, type);
      }} style={{ cursor: type !== 'ongoing' ? 'pointer' : 'default', verticalAlign: 'middle' }}>
        <td>
          <span style={{ fontWeight: 600, color: "#312e81", display: "flex", alignItems: "center", gap: 6 }}>
            <BsBullseye style={{ color: "#6366f1", fontSize: 18 }} /> {g.name}
          </span>
        </td>
        <td>
          <Badge bg="info" style={{ fontSize: 15, padding: "6px 12px" }}>
            <BsBarChart style={{ marginRight: 4 }} /> ₹{g.target_amount}
          </Badge>
        </td>
        <td>
          <Badge bg="success" style={{ fontSize: 15, padding: "6px 12px" }}>
            <BsPiggyBank style={{ marginRight: 4 }} /> ₹{g.saved_amount}
          </Badge>
        </td>
        {showRemaining && (
          <td>
            <Badge bg="warning" style={{ fontSize: 15, padding: "6px 12px" }}>
              ₹{remaining}
            </Badge>
          </td>
        )}
        <td>
          <ProgressBar
            now={percent}
            label={`${percent.toFixed(0)}%`}
            variant={getProgressVariant(percent)}
            style={{ height: 18, borderRadius: 10, fontWeight: 600, fontSize: 14, background: "#e0e7ff" }}
          />
        </td>
        {showDailySaving && (
          <td>
            <span style={{ color: "#059669", fontWeight: 500 }}>
              <BsCheckCircle style={{ marginRight: 4 }} /> ₹{g.expected_daily_saving}
            </span>
          </td>
        )}
        {showCompletedOn && (
          <td>
            <span style={{ color: "#22c55e", fontWeight: 500 }}>
              <BsCheckCircle style={{ marginRight: 4 }} /> {completedOn || "-"}
            </span>
          </td>
        )}
        <td>
          <span style={{ color: "#f59e42", fontWeight: 500 }}>
            <BsCalendar2 style={{ marginRight: 4 }} /> {g.target_date}
          </span>
        </td>
        <td>
          {actions ? (
            <Dropdown as={ButtonGroup}>
              <Button variant="outline-secondary" size="sm">Actions</Button>
              <Dropdown.Toggle split variant="outline-secondary" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => contribute(g.id)}>
                  <BsPlusCircle style={{ marginRight: 6 }} /> Add Saving
                </Dropdown.Item>
                <Dropdown.Item onClick={() => editGoal(g)}>
                  <BsPencilSquare style={{ marginRight: 6 }} /> Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => deleteGoal(g.id)}>
                  <BsTrash style={{ marginRight: 6 }} /> Delete
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => fetchHistory(g)}>
                  <BsClockHistory style={{ marginRight: 6 }} /> History
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <OverlayTrigger overlay={<Tooltip>View History</Tooltip>}>
              <Button size="sm" variant="outline-info" onClick={() => fetchHistory(g)}>
                <BsClockHistory style={{ marginRight: 4 }} /> History
              </Button>
            </OverlayTrigger>
          )}
        </td>
      </tr>
    );
  };

  // --- Enhanced Card Styles ---
  const cardStyle = {
    borderRadius: 22,
    boxShadow: "0 8px 32px 0 rgba(60,72,88,0.13)",
    border: "none",
    background: "linear-gradient(120deg, #f8fafc 80%, #e0e7ff 100%)",
    padding: "2rem 1.5rem"
  };

  // Card color styles for each section
  const cardColors = {
    ongoing: {
      background: "linear-gradient(120deg, #e0f2fe 80%, #f0fdfa 100%)",
      borderLeft: "8px solid #6366f1"
    },
    completed: {
      background: "linear-gradient(120deg, #dcfce7 80%, #f0fdfa 100%)",
      borderLeft: "8px solid #22c55e"
    },
    missed: {
      background: "linear-gradient(120deg, #fee2e2 80%, #fef9c3 100%)",
      borderLeft: "8px solid #f87171"
    }
  };

  return (
    <>
      {/* Background fills the window but does not interfere with scrolling */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          minHeight: "100vh",
          minWidth: "100vw",
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)",
        }}
        aria-hidden="true"
      />
      {/* Main scrollable content */}
      <div className="container py-4" style={{ position: "relative", zIndex: 1 }}>
        {confettiTrigger && <Confetti numberOfPieces={200} recycle={false} />}
        <Card className="shadow-sm mb-4" style={cardStyle}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h2 style={{ fontWeight: 700, color: "#312e81", letterSpacing: "-1px", marginBottom: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <BsBullseye style={{ fontSize: 32, color: "#6366f1" }} />
              My Savings Goals
            </h2>
            <Button
              variant="primary"
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 18,
                padding: "8px 22px",
                boxShadow: "0 2px 8px #6366f133"
              }}
              onClick={() => {
                setFormData({ name: '', target_amount: '', target_date: '' });
                setEditMode(false);
                setShowForm(true);
              }}
            >
              <BsPlusCircle style={{ fontSize: 22, marginRight: 8, marginBottom: 3 }} />
              Add Goal
            </Button>
          </div>
        </Card>

        {/* Ongoing Goals Card */}
        <GoalCard
          title="Ongoing Goals"
          goals={ongoing}
          renderGoalRow={renderGoalRow}
          icon={<BsClock style={{ color: "#6366f1", fontSize: 24, marginRight: 8 }} />}
          style={cardColors.ongoing}
          variant="light"
        />

        {/* Completed Goals Card */}
        <GoalCard
          title="Completed Goals"
          goals={completed}
          renderGoalRow={renderGoalRow}
          icon={<BsCheckCircle style={{ color: "#22c55e", fontSize: 24, marginRight: 8 }} />}
          style={cardColors.completed}
          variant="success"
        />

        {/* Missed Goals Card */}
        <GoalCard
          title="Missed Goals"
          goals={missed}
          renderGoalRow={renderGoalRow}
          icon={<BsXCircle style={{ color: "#f87171", fontSize: 24, marginRight: 8 }} />}
          style={cardColors.missed}
          variant="danger"
        />

        {/* Modal: Add/Edit Form */}
        <Modal show={showForm} onHide={() => setShowForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <BsBullseye style={{ marginRight: 8, color: "#6366f1" }} />
              {editMode ? 'Edit Goal' : 'Add Goal'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>
                  <BsBullseye style={{ marginRight: 6, color: "#6366f1" }} />
                  Goal Name
                </Form.Label>
                <Form.Control
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    fontWeight: 500,
                    fontSize: 16
                  }}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <BsBarChart style={{ marginRight: 6, color: "#059669" }} />
                      Target (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.target_amount}
                      onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        fontWeight: 500,
                        fontSize: 16
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <BsCalendar2 style={{ marginRight: 6, color: "#f59e42" }} />
                      Deadline
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.target_date}
                      onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        fontWeight: 500,
                        fontSize: 16
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              <BsXCircle style={{ marginRight: 6 }} /> Cancel
            </Button>
            <Button variant="success" onClick={handleSubmit}>
              <BsCheckCircle style={{ marginRight: 6 }} /> {editMode ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal: Status Confetti */}
        <Modal show={showStatusModal} onHide={handlePopupClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <BsBullseye style={{ marginRight: 8, color: "#6366f1" }} />
              Goal Update
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center" style={{ fontSize: 20 }}>{statusMsg}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePopupClose}>
              <BsCheckCircle style={{ marginRight: 6 }} /> OK
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal: Goal History */}
        <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <BsClockHistory style={{ marginRight: 8, color: "#6366f1" }} />
              {historyGoal?.name} – History
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((h, idx) => (
                  <tr key={idx}>
                    <td>{h.date}</td>
                    <td>₹{h.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

// New GoalCard component for sectioned cards
const GoalCard = ({ title, goals, renderGoalRow, icon, style, variant = 'light' }) => {
  // Only show Daily Saving and Remaining columns for Ongoing and Missed Goals
  const showDailySaving = title === "Ongoing Goals";
  const showRemaining = title !== "Completed Goals";
  const showCompletedOn = title === "Completed Goals";
  return (
    <Card className="shadow-sm mb-4" style={{ ...style, borderRadius: 20 }}>
      <div className="d-flex align-items-center mb-2" style={{ padding: "1rem 1.5rem 0 1.5rem" }}>
        <h4 style={{ fontWeight: 700, marginBottom: 0, display: "flex", alignItems: "center", gap: 8 }}>
          {icon} {title}
        </h4>
      </div>
      <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {goals.length > 0 ? (
          <Table striped bordered hover responsive className="shadow-sm align-middle" style={{ background: "#fff", borderRadius: 16 }}>
            <thead className="table-dark">
              <tr style={{ verticalAlign: "middle" }}>
                <th>Name</th>
                <th>Target</th>
                <th>Saved</th>
                {showRemaining && <th>Remaining</th>}
                <th>Progress</th>
                {showDailySaving && <th>Daily Saving</th>}
                {showCompletedOn && <th>Completed On</th>}
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map(g =>
                renderGoalRow(
                  g,
                  title.toLowerCase().split(' ')[0],
                  showDailySaving,
                  showRemaining,
                  showCompletedOn
                )
              )}
            </tbody>
          </Table>
        ) : <p className="text-muted mb-0">No goals in this category.</p>}
      </div>
    </Card>
  );
};

export default Goals;
