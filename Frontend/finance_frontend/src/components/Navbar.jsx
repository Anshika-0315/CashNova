import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/apidata';
import profile_pic from '../images/profile_pic.png'; // Default profile picture


const Navbar = ({ alertCount }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);


  useEffect(() => {
  // If user is null, try to fetch user profile using token from localStorage
  if ((!user || !user.profile_photo) && localStorage.getItem('token')) {
    API.get('/api/me/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    }).then(res => {
      setProfilePhoto(res.data.profile_photo);
    });
  } else if (user && user.profile_photo) {
    setProfilePhoto(user.profile_photo);
  }
}, [user]);
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  const logoBarStyle = {
    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    minHeight: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    color: 'white'
  };

  const navbarStyle = {
    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    padding: '0.75rem 1rem',
    borderBottomLeftRadius: '0rem',
    borderBottomRightRadius: '0rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  const navLinkStyle = ({ isActive }) => ({
    color: 'white',
    fontWeight: isActive ? '700' : '400',
    borderBottom: isActive ? '2px solid #ffc107' : '2px solid transparent',
    paddingBottom: '3px',
    transition: 'color 0.3s, border-bottom 0.3s',
    textDecoration: 'none',
  });

  console.log('Navbar user:', user);
  console.log('Navbar profilePhoto:', profilePhoto);

  return (
    <>
      {/* Logo Bar */}
      <div style={logoBarStyle}>
        <div
          style={{
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            minHeight: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            color: 'white',
          }}
          className="flex-column flex-sm-row d-flex w-100"
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontWeight: '700',
              fontSize: '2rem',
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            }}
            className="justify-content-center justify-content-sm-start w-100 mb-2 mb-sm-0"
          >
            <i className="bi bi-cash-coin me-2 fs-2"></i>
            <span>CashNova</span>
          </div>
          <div className="d-flex justify-content-center justify-content-sm-end align-items-center w-100 gap-3">
  {/* Alert Icon beside profile picture with proper spacing and slightly reduced size */}
  {user && (
    <>
      <NavLink to="/profile" className="d-inline-block" title="Profile">
        <img
          src={
            profilePhoto
              ? `http://127.0.0.1:8000/${profilePhoto}`
              : profile_pic
          }
          alt="Profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #fff',
            background: '#eee'
          }}
          onError={e => { e.target.onerror = null; e.target.src = profile_pic; }}
        />
      </NavLink>
      
      <NavLink
        to="/alerts"
        className="nav-link text-white position-relative p-0"
        style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', marginLeft: 10 }}
        title="Alerts"
      >
        <i className="bi bi-bell"></i>
        {alertCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge bg-danger"
            style={{
              fontSize: '0.65rem',
              padding: '0.25em 0.45em',
              lineHeight: '1',
            }}
          >
            {alertCount}
            <span className="visually-hidden">unread alerts</span>
          </span>
        )}
      </NavLink>
    </>
  )}
</div>
          </div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={navbarStyle}>
        <div className="container-fluid">
          <button
            className="navbar-toggler bg-light d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Custom SVG Hamburger Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185a9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  style={navLinkStyle}
                  className="nav-link"
                  end
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" style={navLinkStyle} className="nav-link">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" style={navLinkStyle} className="nav-link">
                  Contact Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/faq" style={navLinkStyle} className="nav-link">
                  FAQs
                </NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink to="/dashboard" style={navLinkStyle} className="nav-link">
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/transactions" style={navLinkStyle} className="nav-link">
                      Transactions
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/budgets" style={navLinkStyle} className="nav-link">
                      Budgets
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/profile" style={navLinkStyle} className="nav-link">
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/goals" style={navLinkStyle} className="nav-link">
                      Goals
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/recurring-payments" style={navLinkStyle} className="nav-link">
                      Recurring Payments
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger rounded-pill px-2 py-1 mb-2 mb-lg-0"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className="btn btn-outline-light rounded-pill px-2 py-1 mb-2 mb-lg-0"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <i className="bi bi-person-plus me-1"></i> Register
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="btn btn-light text-dark rounded-pill px-2 py-1 mb-2 mb-lg-0"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;