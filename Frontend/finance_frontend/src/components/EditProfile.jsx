import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, Button, Form, Row, Col, Container, Spinner, Alert, InputGroup
} from "react-bootstrap";
import { BsPencilSquare, BsXCircle, BsCheckCircle, BsEnvelope, BsPhone, BsGenderAmbiguous, BsCalendarDate, BsPersonCircle, BsCamera } from "react-icons/bs";
import profile_pic from '../images/profile_pic.png';

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
const mobileRegex = /^\d{10}$/;

const fieldIcons = {
  name: <BsPersonCircle style={{ color: "#6366f1", fontSize: 22, marginRight: 8 }} />,
  email: <BsEnvelope style={{ color: "#60a5fa", fontSize: 22, marginRight: 8 }} />,
  mobile: <BsPhone style={{ color: "#34d399", fontSize: 22, marginRight: 8 }} />,
  gender: <BsGenderAmbiguous style={{ color: "#f59e42", fontSize: 22, marginRight: 8 }} />,
  dob: <BsCalendarDate style={{ color: "#f87171", fontSize: 22, marginRight: 8 }} />,
};

const EditProfile = () => {
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/me/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setMessage("Error fetching profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleEditClick = (field) => {
    setEditField(field);
    setTempValue(profile[field]);
    setError("");
  };

  const handleCancel = () => {
    setEditField("");
    setTempValue("");
    setPreview(null);
    setPhoto(null);
    setError("");
  };

  const handleSave = async (field) => {
    // Validation constraints
    if (field === "name" && !nameRegex.test(tempValue)) {
      setError("Name must contain only letters and spaces.");
      return;
    }
    if (field === "email" && !emailRegex.test(tempValue)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (field === "mobile" && !mobileRegex.test(tempValue)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (field === "dob" && tempValue) {
      const dob = new Date(tempValue);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - ((today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) ? 1 : 0);
      if (age < 18) {
        setError("You must be at least 18 years old.");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append(field, tempValue);
      if (field === "profile_photo" && photo) {
        formData.append("profile_photo", photo);
      }
      await axios.put("http://127.0.0.1:8000/api/me/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({ ...prev, [field]: field === "profile_photo" ? preview : tempValue }));
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
      setError("");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
    setEditField("");
    setPreview(null);
    setPhoto(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setTempValue(file);
    setPreview(URL.createObjectURL(file));
    setEditField("profile_photo");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // Gradient background and card shadow
  const pageBg = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4f9 0%, #e0e7ff 100%)",
    padding: "40px 0",
  };
  const cardStyle = {
    borderRadius: 24,
    boxShadow: "0 8px 32px 0 rgba(60,72,88,0.13)",
    border: "none",
    background: "rgba(255,255,255,0.98)",
  };
  const avatarStyle = {
    width: 90,
    height: 90,
    objectFit: "cover",
    borderRadius: "50%",
    border: "4px solid #6366f1",
    boxShadow: "0 4px 16px #6366f133",
    background: "#fff",
  };

  return (
    <div style={pageBg}>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card style={cardStyle} className="shadow p-4">
              <h2 className="text-center mb-4" style={{ fontWeight: 700, color: "#312e81", letterSpacing: "-1px" }}>
                <BsPersonCircle style={{ fontSize: 36, color: "#6366f1", marginBottom: 6, marginRight: 8 }} />
                Profile Settings
              </h2>
              {message && <Alert variant="info">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Profile Photo */}
              <div className="text-center mb-4">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={preview || (profile.profile_photo ? `http://127.0.0.1:8000/${profile.profile_photo}` : profile_pic)}
                    alt="Profile"
                    style={avatarStyle}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px #6366f133",
                      padding: 6,
                      border: "2px solid #fff",
                    }}
                    onClick={() => setEditField("profile_photo")}
                  >
                    <BsCamera style={{ fontSize: 20, color: "#6366f1" }} />
                  </Button>
                </div>
                {editField === "profile_photo" && (
                  <div className="mt-3">
                    <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSave("profile_photo")}
                      className="me-2 mt-2"
                    >
                      <BsCheckCircle /> Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancel}
                      className="mt-2"
                    >
                      <BsXCircle /> Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Fields */}
              {["name", "email", "mobile", "gender", "dob"].map((field) => (
                <div key={field} className="mb-3">
                  <Form.Label className="fw-bold text-capitalize" style={{ color: "#6366f1" }}>
                    {fieldIcons[field]}
                    {field === "dob" ? "Date of Birth" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  {editField === field ? (
                    <InputGroup>
                      {field === "gender" ? (
                        <Form.Select value={tempValue} onChange={(e) => setTempValue(e.target.value)}>
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={field === "dob" ? "date" : field === "email" ? "email" : "text"}
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          {...(field === "mobile" ? { maxLength: 10 } : {})}
                        />
                      )}
                      <Button variant="success" onClick={() => handleSave(field)}>
                        <BsCheckCircle /> Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        <BsXCircle /> Cancel
                      </Button>
                    </InputGroup>
                  ) : (
                    <div
                      className="d-flex align-items-center"
                      style={{
                        justifyContent: "space-between",
                        gap: 8,
                        background: "#f3f4f6",
                        borderRadius: 12,
                        padding: "8px 16px",
                        minHeight: 44,
                      }}
                    >
                      <span style={{ fontSize: 16, color: "#374151", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {profile[field] || <span className="text-muted">Not set</span>}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditClick(field)}
                        style={{ borderRadius: 20, fontWeight: 500, marginLeft: 8, minWidth: 60 }}
                      >
                        <BsPencilSquare /> Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;
