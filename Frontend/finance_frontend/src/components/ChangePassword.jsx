import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Container, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { BsKeyFill, BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

const ChangePassword = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/change-password/", form, {
        headers: { Authorization: `Token ${token}` }
      });
      setMessage(res.data.success || "Password changed successfully.");
      setVariant("success");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const errMsg = err.response?.data?.error;
      setMessage(typeof errMsg === "string" ? errMsg : errMsg?.[0] || "Error changing password");
      setVariant("danger");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow p-4">
            <div className="text-center mb-4">
              <BsKeyFill size={40} className="text-primary" />
              <h2 className="fw-bold mt-2">Change Password</h2>
              <p className="text-muted">Keep your account secure by changing your password regularly.</p>
            </div>

            {message && <Alert variant={variant}>{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  id="old_password"
                  name="old_password"
                  value={form.old_password}
                  onChange={handleChange}
                  placeholder="Old Password"
                  required
                />
                <label htmlFor="old_password">Old Password</label>
              </Form.Floating>

              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="New Password"
                  required
                />
                <label htmlFor="new_password">New Password</label>
              </Form.Floating>

              <Form.Floating className="mb-4">
                <Form.Control
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  required
                />
                <label htmlFor="confirm_password">Confirm New Password</label>
              </Form.Floating>

              <div className="d-grid">
                <Button variant="primary" size="lg" type="submit">
                  <BsCheckCircle className="me-2" /> Change Password
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <BsExclamationCircle className="text-warning" />{" "}
              <small className="text-muted">
                Make sure your new password is strong and different from the old one.
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
