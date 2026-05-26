import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            login(response.data.key);
            setLoading(false);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
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
                flexDirection: 'column'
            }}
        >
            {/* Loading Bar */}
            <LoadingBar loading={loading} />
            {/* Logo and Website Name at Top Left */}
            <div
                style={{
                    position: 'absolute',
                    top: 24,
                    left: 36,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 10,
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: '#185a9d',
                    letterSpacing: '-1px',
                    userSelect: 'none'
                }}
            >
                <i className="bi bi-cash-coin me-2 fs-2" style={{ color: '#1abc9c' }}></i>
                <span style={{
                    background: 'linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    CashNova
                </span>
            </div>
            <div className="container" style={{ maxWidth: 1100 }}>
                <div className="row shadow-lg rounded-4 overflow-hidden" style={{ background: "#fff" }}>
                    {/* Login Section */}
                    <div className="col-md-6 p-5 d-flex flex-column justify-content-center align-items-center">
                        <h2 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>Login to Your Account</h2>
                        <div className="w-100 d-flex align-items-center mb-4" style={{ maxWidth: 340 }}>
                            <hr className="flex-grow-1" />
                            <span className="mx-2 text-secondary">Login below</span>
                            <hr className="flex-grow-1" />
                        </div>
                        {/* Error Toaster */}
                        {error && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 16,
                                    right: 24,
                                    zIndex: 9999,
                                    minWidth: 220,
                                    background: "#f87171",
                                    color: "#fff",
                                    padding: "12px 24px",
                                    borderRadius: 8,
                                    boxShadow: "0 2px 12px #0002",
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                    animation: "fadeIn 0.3s"
                                }}
                            >
                                {error}
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
                        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 340 }}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control form-control-lg rounded-pill"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ background: "#f8fafc" }}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control form-control-lg rounded-pill"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ background: "#f8fafc" }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 rounded-pill py-2 fw-bold"
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
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>
                    </div>
                    {/* New Here Section */}
                    <div
                        className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
                        style={{
                            background: "linear-gradient(135deg, #1abc9c 0%, #185a9d 100%)",
                            padding: "2.5rem 2rem",
                        }}
                    >
                        <h2 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>New Here?</h2>
                        <p className="text-center mb-4" style={{ fontSize: "1.1rem" }}>
                            Create an account to access exclusive features and content.
                        </p>
                        <Link to="/register" className="btn btn-light rounded-pill px-4 py-2 fw-bold" style={{ fontSize: "1.1rem" }}>
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
