import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Simple loading bar component
const LoadingBar = ({ loading }) => (
  loading ? (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: 4,
      zIndex: 9999,
      background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
      animation: "loadingBarAnim 1.2s linear infinite"
    }}>
      <style>
        {`
        @keyframes loadingBarAnim {
          0% { width: 0vw; }
          50% { width: 60vw; }
          100% { width: 100vw; }
        }
        `}
      </style>
    </div>
  ) : null
);

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    declaration: false,
    profilePhoto: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setForm({ ...form, [name]: val });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Name: Only letters and whitespace
    if (!/^[A-Za-z\s]+$/.test(form.name)) {
      setError("Name must contain only letters and spaces.");
      setLoading(false);
      return;
    }

    // Username: At least one special character and one digit
    if (!/(?=.*\d)(?=.*[^A-Za-z0-9])/.test(form.username)) {
      setError("Username must contain at least one special character and one digit.");
      setLoading(false);
      return;
    }

    // Email: Must be valid format
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // DOB: Must be at least 18 years old
    if (form.dob) {
      const dob = new Date(form.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - ((today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) ? 1 : 0);
      if (age < 18) {
        setError("You must be at least 18 years old to register.");
        setLoading(false);
        return;
      }
    }

    // Password: At least 8 chars, one digit, one special char
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!/\d/.test(form.password)) {
      setError("Password must contain at least one digit.");
      setLoading(false);
      return;
    }
    if (!/[^A-Za-z0-9]/.test(form.password)) {
      setError("Password must contain at least one special character.");
      setLoading(false);
      return;
    }

    // Declaration
    if (!form.declaration) {
      setError("Please accept the declaration.");
      setLoading(false);
      return;
    }

    // Passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append("gender", form.gender);
      formData.append("dob", form.dob);
      formData.append("password", form.password);
      if (form.profilePhoto) {
        formData.append("profilePhoto", form.profilePhoto);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      localStorage.setItem("token", response.data.key);
      setSuccess("Registration successful!");
      setError("");
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      // Show first error from backend if available
      const backendError = err.response?.data;
      if (backendError && typeof backendError === "object") {
        const firstKey = Object.keys(backendError)[0];
        setError(Array.isArray(backendError[firstKey]) ? backendError[firstKey][0] : backendError[firstKey]);
      } else {
        setError("Registration failed");
      }
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(90deg, #f8fafc 0%, #e0f7fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Loading Bar */}
      <LoadingBar loading={loading} />
      <div className="container" style={{ maxWidth: 1150, zIndex: 2 }}>
        <div className="row align-items-stretch shadow-lg rounded-4 overflow-hidden" style={{ background: "#fff", position: "relative" }}>
          {/* Website name and logo at top left of card */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 24,
              display: "flex",
              alignItems: "center",
              zIndex: 10,
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#fff",
              letterSpacing: "-1px",
              userSelect: "none",
              textShadow: "0 2px 8px #185a9d99"
            }}
          >
            <i className="bi bi-cash-coin me-2 fs-5" style={{ color: "#fff", filter: "drop-shadow(0 1px 4px #185a9d99)", fontSize: "1.7rem" }}></i>
            <span style={{
              color: "#fff",
              WebkitBackgroundClip: "unset",
              WebkitTextFillColor: "unset",
              textShadow: "0 2px 8px #185a9d99"
            }}>
              CashNova
            </span>
          </div>
          {/* Welcome Section - Centered Content */}
          <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center p-0"
            style={{
              background: "linear-gradient(135deg, #1abc9c 0%, #185a9d 100%)",
              position: "relative"
            }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              zIndex: 2,
              maxWidth: 340,
              textAlign: "center"
            }}>
              <h2 className="fw-bold mb-3" style={{ fontSize: "2.1rem", textShadow: "1px 1px 8px #185a9d55" }}>
                Welcome to CashNova!
              </h2>
              <p style={{ fontSize: "1.08rem", lineHeight: 1.6, marginBottom: 22 }}>
                Join CashNova and start your journey to smarter money management. Track expenses, set budgets, and reach your goals—all in one place.
              </p>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                paddingLeft: 0,
                marginBottom: 18
              }}>
                <div>✔️ Easy expense tracking</div>
                <div>✔️ Smart budgeting</div>
                <div>✔️ Secure & private</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.13)",
                borderRadius: "12px",
                padding: "0.8rem 1rem",
                fontSize: "1rem"
              }}>
                “Start today for a brighter tomorrow.”
              </div>
            </div>
          </div>
          {/* Registration Form Section */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center align-items-center">
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>Register Yourself</h2>
            <div className="w-100 d-flex align-items-center mb-4" style={{ maxWidth: 540 }}>
              <hr className="flex-grow-1" />
              <span className="mx-2 text-secondary">Create your account</span>
              <hr className="flex-grow-1" />
            </div>
            {/* Error/Success Toaster */}
            {(error || success) && (
              <div
                style={{
                  position: "fixed",
                  top: 16,
                  right: 24,
                  zIndex: 9999,
                  minWidth: 220,
                  background: error ? "#f87171" : "#22c55e",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 8,
                  boxShadow: "0 2px 12px #0002",
                  fontWeight: 500,
                  fontSize: "1rem",
                  animation: "fadeIn 0.3s"
                }}
              >
                {error || success}
                <style>
                  {`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px);}
                    to { opacity: 1; transform: translateY(0);}
                  }
                  `}
                </style>
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 540 }}>
              <div className="row">
                {/* First Column */}
                <div className="col-md-6">
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Full Name" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Email" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Password" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-calendar-date-fill"></i></span>
                    <input type="date" name="dob" value={form.dob} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label d-block"><i className="bi bi-gender-ambiguous me-2"></i>Gender</label>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" name="gender" value="male" checked={form.gender === "male"} onChange={handleChange} required />
                      <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" name="gender" value="female" checked={form.gender === "female"} onChange={handleChange} />
                      <label className="form-check-label">Female</label>
                    </div>
                  </div>
                </div>
                {/* Second Column */}
                <div className="col-md-6">
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-person-badge-fill"></i></span>
                    <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" placeholder="Username" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                    <input type="tel" name="mobile" maxLength="10" value={form.mobile} onChange={handleChange} className="form-control" placeholder="Mobile Number" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-control" placeholder="Confirm Password" required />
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-image-fill"></i></span>
                    <input type="file" name="profilePhoto" className="form-control" accept="image/*" onChange={handleChange} />
                  </div>
                  <div className="form-check mb-3 mt-2">
                    <input className="form-check-input" type="checkbox" name="declaration" checked={form.declaration} onChange={handleChange} />
                    <label className="form-check-label">I confirm the above details are correct.</label>
                  </div>
                </div>
              </div>
              {/* Register Button at the bottom */}
              <button
                type="submit"
                className="btn w-100 rounded-pill py-2 fw-bold mt-2"
                style={{
                  fontSize: "1.1rem",
                  background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
                  color: "#fff",
                  border: "none",
                  transition: "background 0.3s, box-shadow 0.3s"
                }}
                disabled={loading}
                onMouseOver={e => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #185a9d 0%, #1abc9c 100%)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,188,156,0.13), 0 2px 8px rgba(24,90,157,0.10)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="text-center mt-4">
                <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                  Already have an account? <Link to="/login" style={{ textDecoration: "none", color: "#185a9d", fontWeight: 500 }}>Login here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


