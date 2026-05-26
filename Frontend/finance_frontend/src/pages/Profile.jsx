import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import profile_pic from '../images/profile_pic.png';

import { BsWallet2, BsArrowDownCircle, BsArrowUpCircle, BsListCheck, BsRepeat } from "react-icons/bs";
import { Modal } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [showPicModal, setShowPicModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Fetch user data and stats
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/me/', {
          headers: { Authorization: `Token ${token}` }
        });
        setUser(response.data);

        // Fetch financial summary
        const summaryRes = await axios.get('http://127.0.0.1:8000/api/summary/', {
          headers: { Authorization: `Token ${token}` }
        });

        // Fetch budgets and recurring payments count
        const budgetsRes = await axios.get('http://127.0.0.1:8000/api/budgets/', {
          headers: { Authorization: `Token ${token}` }
        });
        const recurringRes = await axios.get('http://127.0.0.1:8000/api/recurring-payments/', {
          headers: { Authorization: `Token ${token}` }
        });

        setOverview({
          balance: summaryRes.data.balance,
          expenses_this_month: summaryRes.data.total_expense,
          income_this_month: summaryRes.data.total_income,
          budgets_count: Array.isArray(budgetsRes.data) ? budgetsRes.data.length : (budgetsRes.data.results ? budgetsRes.data.results.length : 0),
          recurring_payments_count: Array.isArray(recurringRes.data) ? recurringRes.data.length : (recurringRes.data.results ? recurringRes.data.results.length : 0)
        });
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // If data is loading
  if (loading) {
    return (
      <div className="container text-center py-5" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ede9fe 0%, #f3f0ff 100%)" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // Profile picture URL
  const profilePhotoUrl = user && user.profile_photo
    ? `http://127.0.0.1:8000/${user.profile_photo}`
    : profile_pic;

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(135deg, #ede9fe 0%, #f3f0ff 100%)",
        padding: "40px 0"
      }}
    >
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div
          className="card shadow-lg border-0 w-100"
          style={{
            maxWidth: 1150, // Increased from 900 to 1150
            borderRadius: 32,
            background: "linear-gradient(120deg, #f3f0ff 80%, #ede9fe 100%)",
            boxShadow: "0 8px 32px #a78bfa33",
            padding: "32px 0"
          }}
        >
          <div className="px-4 px-md-5">
            {error && <div className="alert alert-danger">{error}</div>}

            {user ? (
              <>
                {/* Profile Header */}
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start mb-4">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      className="rounded-circle mb-3 mb-md-0 shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "4px solid #a78bfa",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s"
                      }}
                      onClick={() => setShowPicModal(true)}
                      title="Click to view"
                    />
                  </div>
                  <div className="ms-md-4">
                    <h4 className="mb-1" style={{ color: "#7c3aed", fontWeight: 700, letterSpacing: "-1px" }}>{user.name}</h4>
                    <p className="mb-0 text-muted" style={{ fontSize: 17 }}>{user.username}</p>
                  </div>
                </div>

                {/* Profile Picture Modal (Square, no black bg, blurred page) */}
                <Modal
                  show={showPicModal}
                  onHide={() => setShowPicModal(false)}
                  centered
                  contentClassName="border-0 bg-transparent"
                  dialogClassName="profile-pic-modal"
                  backdropClassName="profile-pic-backdrop"
                  style={{ background: "none" }}
                >
                  <Modal.Body
                    style={{
                      background: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      minHeight: "100vh"
                    }}
                  >
                    <img
                      src={profilePhotoUrl}
                      alt="Profile Large"
                      style={{
                        width: "350px",
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "18px",
                        boxShadow: "0 8px 32px #a78bfa99",
                        border: "8px solid #fff",
                        background: "#fff"
                      }}
                    />
                  </Modal.Body>
                </Modal>

                {/* Financial Overview */}
                {overview && (
                  <>
                    <hr
                      style={{
                        border: 0,
                        height: 2,
                        background: "linear-gradient(90deg, #ede9fe 0%, #a78bfa 50%, #ede9fe 100%)",
                        opacity: 0.5,
                        margin: "32px 0 24px 0",
                        borderRadius: 8
                      }}
                    />
                    <div className="row mb-4 justify-content-center">
                      <div className="col-12">
                        <div className="row g-4 justify-content-center">
                          {/* Income */}
                          <div className="col-6 col-md-2 d-flex">
                            <div
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                              style={{
                                background: "linear-gradient(120deg, #e0e7ff 70%, #f3f0ff 100%)",
                                borderRadius: 20,
                                border: "2px solid #a5b4fc",
                                minHeight: 140,
                                minWidth: 140,
                                boxShadow: "0 4px 16px #a5b4fc22",
                                padding: 16
                              }}
                            >
                              <BsArrowUpCircle size={32} className="mb-2 text-primary" />
                              <div className="fw-bold" style={{ fontSize: 17 }}>Income</div>
                              <div className="fs-5 text-primary">₹{overview.income_this_month}</div>
                            </div>
                          </div>
                          {/* Expenses */}
                          <div className="col-6 col-md-2 d-flex">
                            <div
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                              style={{
                                background: "linear-gradient(120deg, #fefce8 70%, #f3f0ff 100%)",
                                borderRadius: 20,
                                border: "2px solid #fde68a",
                                minHeight: 140,
                                minWidth: 140,
                                boxShadow: "0 4px 16px #fde68a22",
                                padding: 16
                              }}
                            >
                              <BsArrowDownCircle size={32} className="mb-2 text-danger" />
                              <div className="fw-bold" style={{ fontSize: 17 }}>Expenses</div>
                              <div className="fs-5 text-danger">₹{overview.expenses_this_month}</div>
                            </div>
                          </div>
                          {/* Balance */}
                          <div className="col-6 col-md-2 d-flex">
                            <div
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                              style={{
                                background: "linear-gradient(120deg, #e8f5e9 70%, #f3f0ff 100%)",
                                borderRadius: 20,
                                border: "2px solid #4caf50",
                                minHeight: 140,
                                minWidth: 140,
                                boxShadow: "0 4px 16px #4caf5022",
                                padding: 16
                              }}
                            >
                              <BsWallet2 size={32} className="mb-2 text-success" />
                              <div className="fw-bold" style={{ fontSize: 17 }}>Balance</div>
                              <div className="fs-5 text-success">₹{overview.balance}</div>
                            </div>
                          </div>
                          {/* Budgets Set */}
                          <div className="col-6 col-md-2 d-flex">
                            <div
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                              style={{
                                background: "linear-gradient(120deg, #f0fdf4 70%, #f3f0ff 100%)",
                                borderRadius: 20,
                                border: "2px solid #86efac",
                                minHeight: 140,
                                minWidth: 140,
                                boxShadow: "0 4px 16px #86efac22",
                                padding: 16
                              }}
                            >
                              <BsListCheck size={32} className="mb-2 text-info" />
                              <div className="fw-bold" style={{ fontSize: 17 }}>Budgets</div>
                              <div className="fs-5 text-info">{overview.budgets_count}</div>
                            </div>
                          </div>
                          {/* Recurring Payments */}
                          <div className="col-6 col-md-2 d-flex">
                            <div
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                              style={{
                                background: "linear-gradient(120deg, #fff7ed 70%, #f3f0ff 100%)",
                                borderRadius: 20,
                                border: "2px solid #ffbb33",
                                minHeight: 140,
                                minWidth: 140,
                                boxShadow: "0 4px 16px #ffbb3322",
                                padding: 16
                              }}
                            >
                              <BsRepeat size={32} className="mb-2 text-warning" />
                              <div className="fw-bold" style={{ fontSize: 17 }}>Recurring</div>
                              <div className="fs-5 text-warning">{overview.recurring_payments_count}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr
                      style={{
                        border: 0,
                        height: 2,
                        background: "linear-gradient(90deg, #ede9fe 0%, #a78bfa 50%, #ede9fe 100%)",
                        opacity: 0.5,
                        margin: "24px 0 32px 0",
                        borderRadius: 8
                      }}
                    />
                  </>
                )}

                {/* More Options */}

                <div className="mt-4">
                  <h4 className="mb-3" style={{ color: "#6366f1", fontWeight: 700 }}>More Options</h4>
                  <ul className="list-group shadow-sm" style={{ borderRadius: 14, overflow: "hidden" }}>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center option-list-item"
                      style={{ background: "#f8fafc", fontSize: 16, border: "none", transition: "background 0.2s" }}
                      onClick={() => { navigate("/edit-profile"); }}
                      tabIndex={0}
                      onKeyPress={e => { if (e.key === "Enter") navigate("/edit-profile"); }}
                      role="button"
                    >
                      <span>
                        <i className="bi bi-person-gear me-2" style={{ color: "#6366f1", fontSize: 18 }}></i>
                        Edit Profile
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary px-3"
                        style={{ borderRadius: 20, fontWeight: 500 }}
                        onClick={e => { e.stopPropagation(); navigate("/edit-profile"); }}
                      >
                        Edit
                      </button>
                    </li>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center option-list-item"
                      style={{ background: "#f8fafc", fontSize: 16, border: "none", transition: "background 0.2s" }}
                      onClick={() => { navigate("/change-password"); }}
                      tabIndex={0}
                      onKeyPress={e => { if (e.key === "Enter") navigate("/change-password"); }}
                      role="button"
                    >
                      <span>
                        <i className="bi bi-lock me-2" style={{ color: "#6366f1", fontSize: 18 }}></i>
                        Change Password
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary px-3"
                        style={{ borderRadius: 20, fontWeight: 500 }}
                        onClick={e => { e.stopPropagation(); navigate("/change-password"); }}
                      >
                        Change
                      </button>
                    </li>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center option-list-item logout-list-item"
                      style={{ background: "#fff1f2", fontSize: 16, border: "none", transition: "background 0.2s" }}
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      tabIndex={0}
                      onKeyPress={e => { if (e.key === "Enter") { logout(); navigate("/login"); } }}
                      role="button"
                    >
                      <span>
                        <i className="bi bi-box-arrow-right me-2" style={{ color: "#e11d48", fontSize: 18 }}></i>
                        Logout
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger px-3"
                        style={{ borderRadius: 20, fontWeight: 500 }}
                        onClick={e => { e.stopPropagation(); logout(); navigate("/login"); }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                  <style>
                    {`
                      .option-list-item:hover {
                        background: #ede9fe !important;
                        cursor: pointer;
                      }
                      .logout-list-item:hover {
                        background: #ffe4e6 !important;
                        cursor: pointer;
                      }
                    `}
                  </style>
                </div>
              </>
            ) : (
              <p>No user data available</p>
            )}
          </div>
        </div>
        {/* Blur overlay for modal */}
        {showPicModal && (
          <div
            style={{
              position: "fixed",
              zIndex: 1040,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              pointerEvents: "none"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;




