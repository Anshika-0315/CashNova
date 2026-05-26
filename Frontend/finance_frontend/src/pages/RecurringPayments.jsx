import React, { useEffect, useState } from 'react';
import API from '../api/apidata';
import { Card, Button, Form, Modal, Row, Col, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  BsClockHistory, BsCalendarEvent, BsRepeat, BsCashStack, BsCreditCard2Front, BsCalendar2Check, BsCalendar2Heart, BsCalendar2X
} from 'react-icons/bs';

const getNextDueDate = (startDate, interval) => {
  let date = new Date(startDate);
  const today = new Date();
  while (date < today) {
    switch (interval) {
      case 'DAILY': date.setDate(date.getDate() + 1); break;
      case 'WEEKLY': date.setDate(date.getDate() + 7); break;
      case 'MONTHLY': date.setMonth(date.getMonth() + 1); break;
      case 'YEARLY': date.setFullYear(date.getFullYear() + 1); break;
      default: break;
    }
  }
  return date.toISOString().split('T')[0];
};

const getPaymentIcon = (name) => {
  if (!name) return <BsCreditCard2Front style={{ color: "#6366f1" }} />;
  const lower = name.toLowerCase();
  if (lower.includes("netflix") || lower.includes("subscription")) return <BsCalendar2Heart style={{ color: "#e11d48" }} />;
  if (lower.includes("rent")) return <BsCashStack style={{ color: "#059669" }} />;
  if (lower.includes("loan")) return <BsCreditCard2Front style={{ color: "#6366f1" }} />;
  if (lower.includes("insurance")) return <BsCalendar2Check style={{ color: "#0ea5e9" }} />;
  if (lower.includes("emi")) return <BsCreditCard2Front style={{ color: "#6366f1" }} />;
  if (lower.includes("gym")) return <BsCalendar2Heart style={{ color: "#f59e42" }} />;
  return <BsRepeat style={{ color: "#6366f1" }} />;
};

const RecurringPayments = () => {
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [upcoming, setUpcoming] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    start_date: '',
    repeat_interval: 'MONTHLY'
  });

  useEffect(() => {
    fetchPayments();
    fetchUpcoming();
  }, []);

  const fetchPayments = async () => {
    const res = await API.get('/api/recurring-payments/');
    const updated = res.data.results.map(p => ({
      ...p,
      next_due_date: getNextDueDate(p.next_due_date || p.start_date, p.repeat_interval)
    }));
    setPayments(updated);
  };

  const fetchUpcoming = async () => {
    const res = await API.get('/api/recurring-payments/upcoming/');
    const arr = Array.isArray(res.data) ? res.data : [];
    const updated = arr.map(p => ({
      ...p,
      next_due_date: getNextDueDate(p.next_due_date || p.start_date, p.repeat_interval)
    }));
    setUpcoming(updated);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount || !formData.start_date) {
      alert("Please fill all fields.");
      return;
    }
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      next_due_date: getNextDueDate(formData.start_date, formData.repeat_interval)
    };
    try {
      await API.post('/api/recurring-payments/', payload);
      fetchPayments();
      setShow(false);
      setFormData({ name: '', amount: '', start_date: '', repeat_interval: 'MONTHLY' });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save. Please check your input.");
    }
  };

  const displayAmount = formData.amount !== '' ? parseFloat(formData.amount) : '';

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)",
        padding: 0,
        margin: 0
      }}
    >
      <div className="container py-4">
        {/* Upcoming Payments Super Card */}
        {Array.isArray(upcoming) && upcoming.length > 0 && (
          <Card
            className="mb-5 shadow-lg"
            style={{
              borderRadius: 28,
              border: "2.5px solid #fde68a",
              background: "linear-gradient(120deg, #fefce8 70%, #fef9c3 100%)",
              boxShadow: "0 8px 32px #f59e4233"
            }}
          >
            <Card.Body>
              <motion.h4
                className="mb-4"
                style={{
                  color: "#f59e42",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BsClockHistory style={{ fontSize: 28 }} />
                Upcoming Payments (Next 7 Days)
              </motion.h4>
              <Row>
                {upcoming.map((p, i) => (
                  <Col md={4} key={`upcoming-${i}`}>
                    <motion.div
                      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #f59e4255" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        className="shadow border-0 mb-4"
                        style={{
                          borderRadius: 20,
                          border: "1.5px solid #fde68a",
                          background: "linear-gradient(120deg, #fefce8 70%, #fef9c3 100%)",
                          minHeight: 160
                        }}
                      >
                        <Card.Body>
                          <div className="d-flex align-items-center mb-2">
                            <div style={{
                              borderRadius: "50%",
                              background: "#fff",
                              boxShadow: "0 2px 8px #fde68a",
                              padding: 10,
                              marginRight: 14,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              {getPaymentIcon(p.name)}
                            </div>
                            <div>
                              <Card.Title className="mb-0" style={{ color: "#b45309", fontWeight: 700, fontSize: 20 }}>
                                {p.name}
                              </Card.Title>
                              <Badge bg="warning" text="dark" className="ms-1" style={{ fontWeight: 500, fontSize: 13 }}>{p.repeat_interval}</Badge>
                            </div>
                          </div>
                          <div style={{ color: "#ca8a04", fontWeight: 700, fontSize: 18 }}>
                            ₹{p.amount}
                          </div>
                          <div className="text-muted mt-1" style={{ fontSize: 15 }}>
                            Due on <span style={{ color: "#e11d48", fontWeight: 600 }}>{p.next_due_date}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Recurring Payments Super Card */}
        <Card
          className="mb-5 shadow-lg"
          style={{
            borderRadius: 28,
            border: "2.5px solid #86efac", // light green border
            background: "linear-gradient(120deg, #f0fdf4 70%, #e0f2fe 100%)", // light green gradient
            boxShadow: "0 8px 32px #05966922"
          }}
        >
          <Card.Body>
            <Row className="mb-4 align-items-center">
              <Col>
                <h2 className="fw-bold" style={{
                  color: "#059669",
                  letterSpacing: "-1.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}>
                  <BsCalendarEvent style={{ fontSize: 30 }} />
                  Recurring Payments
                </h2>
              </Col>
              <Col className="text-end">
                <Button
                  variant="primary"
                  style={{
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: 17,
                    padding: "8px 28px",
                    boxShadow: "0 2px 8px #6366f133",
                    letterSpacing: "0.5px"
                  }}
                  onClick={() => setShow(true)}
                >
                  + Add Payment
                </Button>
              </Col>
            </Row>
            <Row>
              {payments.length === 0 ? (
                <Col>
                  <Card className="shadow-sm border-0" style={{
                    borderRadius: 18,
                    background: "linear-gradient(120deg, #f0fdf4 70%, #e0f2fe 100%)"
                  }}>
                    <Card.Body className="text-center text-muted py-5">
                      <BsCalendar2X style={{ fontSize: 38, color: "#6366f1" }} />
                      <div className="mt-3" style={{ fontSize: 18 }}>No recurring payments added yet.</div>
                    </Card.Body>
                  </Card>
                </Col>
              ) : (
                payments.map((p, index) => (
                  <Col md={4} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px #05966933" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="mb-4 shadow border-0" style={{
                        borderRadius: 20,
                        border: "1.5px solid #86efac",
                        background: "linear-gradient(120deg, #f0fdf4 70%, #e0f2fe 100%)",
                        minHeight: 180
                      }}>
                        <Card.Body>
                          <div className="d-flex align-items-center mb-2">
                            <div style={{
                              borderRadius: "50%",
                              background: "#fff",
                              boxShadow: "0 2px 8px #e0e7ff",
                              padding: 10,
                              marginRight: 14,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              {getPaymentIcon(p.name)}
                            </div>
                            <div>
                              <Card.Title className="mb-0" style={{ color: "#312e81", fontWeight: 700, fontSize: 20 }}>
                                {p.name}
                              </Card.Title>
                              <Badge bg="success" className="ms-1" style={{ fontWeight: 500, fontSize: 13 }}>{p.repeat_interval}</Badge>
                            </div>
                          </div>
                          <div style={{ color: "#059669", fontWeight: 700, fontSize: 18 }}>
                            ₹{p.amount}
                          </div>
                          <div className="text-muted mt-1" style={{ fontSize: 15 }}>
                            Next Due: <span style={{ color: "#e11d48", fontWeight: 600 }}>{p.next_due_date}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* Modal for Add Payment */}
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton style={{ background: "#e0e7ff" }}>
            <Modal.Title>
              <BsRepeat style={{ color: "#6366f1", marginRight: 8, marginBottom: 3 }} />
              Add Recurring Payment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: "#f8fafc" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>Payment Name</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Netflix Subscription" style={{ borderRadius: 14, fontSize: 16 }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>Amount (₹)</Form.Label>
                <Form.Control type="number" name="amount" value={displayAmount} onChange={handleChange} placeholder="e.g. 499" style={{ borderRadius: 14, fontSize: 16 }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>Start Date</Form.Label>
                <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={{ borderRadius: 14, fontSize: 16 }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600, color: "#6366f1" }}>Repeat Interval</Form.Label>
                <Form.Select name="repeat_interval" value={formData.repeat_interval} onChange={handleChange} style={{ borderRadius: 14, fontSize: 16 }}>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ background: "#e0e7ff" }}>
            <Button variant="secondary" onClick={() => setShow(false)} style={{ borderRadius: 14 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} style={{ borderRadius: 14, fontWeight: 600 }}>
              Save Payment
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RecurringPayments;
