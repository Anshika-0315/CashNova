import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';



export default function HomePage() {
  // State for modal image
  const [modalImg, setModalImg] = useState(null);

  // Helper to open modal
  const openModal = (src, alt) => setModalImg({ src, alt });
  // Helper to close modal
  const closeModal = () => setModalImg(null);


  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth && auth.user) {
      navigate('/budgets');
    } else {
      navigate('/login');
    }
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="text-white text-center position-relative"
        style={{
          // background: "linear-gradient(135deg, #1abc9c 0%, #185a9d 100%)", // Removed background
          overflow: "hidden",
          paddingBottom: "80px", // reduced from 150px to 80px
          position: "relative"
        }}
      >
        {/* Navbar - transparent background, no border radius or shadow */}
        <nav
          className="navbar navbar-expand-lg navbar-dark container py-3"
          style={{
            background: "transparent",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            boxShadow: "none"
            
          }}
        >
          {/* <a className="navbar-brand fw-bold" href="/" style={{ letterSpacing: "2px" }}>
            <i className="bi bi-cash-coin me-2"></i>CashNova
          </a> */}
        </nav>

        <div className="container py-3 text-dark">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: 1.1 }}>
                Master Your Money<br className="d-none d-lg-block" /> with <span style={{ color: "#185a9d", fontWeight: 700 }}>Confidence</span>
              </h1>
              <br />

              <p className="lead mb-4 "
                 style={{ fontWeight: 600, fontSize: "1.6rem", letterSpacing: "1px" }}
              >
                <span style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 800,
                  fontSize: "2rem",
                  letterSpacing: "2px"
                }}>
                  Track. Plan. Prosper.
                </span>
                <br className="d-none d-md-block" />
                <span style={{
                  display: "inline-block",
                  marginTop: 10,
                  color: "#185a9d",
                  fontWeight: 500,
                  fontSize: "1.15rem",
                  letterSpacing: "0.5px"
                }}>
                  Your financial wellness starts here.
                </span>
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button
                  className="btn btn-lg px-4 text-white shadow-sm"
                  style={{
                    background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(30,90,157,0.12)",
                    transition: "background 0.3s, box-shadow 0.3s",

                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "linear-gradient(90deg, #185a9d 0%, #1abc9c 100%)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,188,156,0.13), 0 2px 8px rgba(24,90,157,0.10)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={handleGetStarted}
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Start Now
                </button>
                <button
                  className="btn btn-outline-primary btn-lg px-4"
                  style={{
                    borderWidth: 2
                  }}
                  onClick={handleLearnMore}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src="/images/top_img.svg"
                alt="Finance Illustration"
                className="img-fluid"
                style={{ maxHeight: 400, marginLeft: "-50px" }}
              />
            </div>
          </div>
        </div>

      </div>

            {/* Professional Value Proposition Section */}
      <div
  className="container-fluid py-4" // reduced from py-5/py-3 to py-4
  style={{
    // background: "linear-gradient(rgb(232, 249, 245) 100%)",
    // borderRadius: "0 0 2rem 2rem",
    // marginBottom: "2rem",
    // boxShadow: "0 4px 24px rgba(30,90,157,0.06)",
    // marginTop: "-40px" // negative margin to pull section up
  }}
>
  <div className="container">
    <div className="row align-items-center">
      <div className="col-lg-8 text-lg-start text-center mb-4 mb-lg-0">
        <h2
          className="fw-bold mb-3"
          style={{
            color: "#185a9d",
            fontSize: "2.5rem",
            letterSpacing: "1px",
            lineHeight: 1.2,
          }}
        >
          Empowering Your <span style={{ color: "#1abc9c" }}>Financial Journey</span>
        </h2>
        <p className="lead text-secondary mb-4" style={{ fontSize: "1.25rem" }}>
          CashNova combines intuitive design, robust analytics, and enterprise-grade security to help you make smarter financial decisions—whether you’re an individual, entrepreneur, or business leader.
        </p>
        <ul className="list-unstyled text-secondary mb-4">
          <li className="d-flex align-items-center mb-2">
            <span
              className="d-inline-flex align-items-center justify-content-center me-3"
              style={{
                width: 44,
                height: 44,
                background: "#e8faf6",
                borderRadius: "50%",
              }}
            >
              <i className="bi bi-bar-chart-line-fill text-primary fs-4"></i>
            </span>
            <span style={{ fontWeight: 500 }}>Real-time analytics and actionable insights</span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <span
              className="d-inline-flex align-items-center justify-content-center me-3"
              style={{
                width: 44,
                height: 44,
                background: "#eafaf1",
                borderRadius: "50%",
              }}
            >
              <i className="bi bi-shield-lock-fill text-success fs-4"></i>
            </span>
            <span style={{ fontWeight: 500 }}>Advanced security and privacy for your data</span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <span
              className="d-inline-flex align-items-center justify-content-center me-3"
              style={{
                width: 44,
                height: 44,
                background: "#f0f6fa",
                borderRadius: "50%",
              }}
            >
              <i className="bi bi-people-fill text-info fs-4"></i>
            </span>
            <span style={{ fontWeight: 500 }}>Trusted by thousands of users and professionals</span>
          </li>
        </ul>
        {/* <a href="/about" className="btn btn-primary px-4 py-2 shadow-sm" style={{ fontWeight: 600, fontSize: "1.1rem" }}>
          Discover More
        </a> */}
      </div>
      {/* <div className="col-lg-6 text-center">
        <img
          src="/images/value_proposition.svg"
          alt="Empower Your Finances"
          className="img-fluid rounded-4 shadow"
          style={{ maxWidth: 400, background: "#fff", padding: "1.5rem" }}
        />
      </div> */}
    </div>
  </div>
</div>

      {/* Image Gallery Section */}
      <div className="container py-5">
        <div className="p-4 rounded-4 shadow-sm bg-white bg-opacity-75">
          {/* First row: Image left, text right */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="gallery-img">
                <img
                  src="/images/budgets.avif"
                  alt="Budget Smarter"
                  // className="img-fluid rounded shadow gallery-img"
                  style={{ maxWidth: "400px", cursor: "pointer" }}
                 
                />
              </div>
            </div>
            <div className="col-md-6 text-md-start text-center">
              <h4 className="fw-bold">Budget Smarter</h4>
              <p>Create custom budgets to always know how much money you still have available.
                 It's possible to select more than one category for each budget.Create custom envelopes and manage your money with clarity and purpose.</p>
            </div>
          </div>
          {/* Second row: Text left, image right */}
          <div className="row align-items-center mb-4 flex-md-row-reverse">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="gallery-img">
                <img
                  src="/images/track_expenses.png"
                  alt="Track Every Expense"
                  // className="img-fluid rounded shadow gallery-img"
                  style={{ maxWidth: "500px", cursor: "pointer" }}
                  // onClick={() => openModal("/images/track_expenses.png", "Track Every Expense")}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end text-center">
              <h4 className="fw-bold">Track Every Expense</h4>
              <p>It takes seconds to record daily transactions. Put them into clear and visualized categories such as Expense: Food, Shopping or Income: Salary, Gift.</p>
            </div>
          </div>
          {/* Third row: Image left, text right */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="gallery-img">
                <img
                  src="/images/secure.jpg"
                  alt="Safe & Secure"
                  // className="img-fluid rounded shadow gallery-img"
                  style={{ maxWidth: "500px", cursor: "pointer" }}
                  
                />
              </div>
            </div>
            <div className="col-md-6 text-md-start text-center">
              <h4 className="fw-bold">Safe & Secure</h4>
              <p>Your data is protected with industry-leading security and privacy standards.</p>
            </div>
          </div>
          {/* Fourth row: Text left, image right */}
          <div className="row align-items-center mb-4 flex-md-row-reverse">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="gallery-img">
                <img
                  src="/images/goal.jpg"
                  alt="Set Financial Goals"
                  // className="img-fluid rounded shadow gallery-img"
                  style={{ maxWidth: "500px", cursor: "pointer" }}
                  
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end text-center">
              <h4 className="fw-bold">Set Financial Goals</h4>
              <p>Define your financial objectives and track your progress effortlessly.</p>
            </div>
          </div>
        </div>
      </div>

       
      

      {/* Image Modal */}
      {modalImg && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.7)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2000,
          }}
          onClick={closeModal}
        >
          <div
            className="d-flex align-items-center justify-content-center h-100"
            style={{ pointerEvents: "none" }}
          >
            <img
              src={modalImg.src}
              alt={modalImg.alt}
              className="rounded shadow"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                background: "#fff",
                pointerEvents: "auto",
                padding: "1rem",
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <button
            type="button"
            className="btn btn-light position-fixed"
            style={{ top: 30, right: 40, zIndex: 2100, fontSize: "1.5rem", pointerEvents: "auto" }}
            onClick={closeModal}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}

      {/* Features Section */}
      <div className="container py-5 text-center">
        <h2 className="section-title mb-4">Why Use CashNova?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="why-card p-4 border rounded shadow-sm h-100 bg-white">
              <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', background: "#e8faf6" }}>
                <i className="bi bi-wallet2 fs-3"></i>
              </div>
              <h5>Easy Budgeting</h5>
              <p>Create and manage envelopes for all your expenses easily.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="why-card p-4 border rounded shadow-sm h-100 bg-white">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-graph-up-arrow fs-3"></i>
              </div>
              <h5>Track Expenses</h5>
              <p>Visualize your spending with real-time charts and graphs.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="why-card p-4 border rounded shadow-sm h-100 bg-white">
              <div className="bg-warning-subtle text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-shield-lock fs-3"></i>
              </div>
              <h5>Secure & Private</h5>
              <p>Your data is encrypted and protected with industry standards.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-5 text-center" style={{ background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)" }}>
        <div className="container">
          <h2 className="section-title mb-4">What Our Users Say</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 testimonial-card">
                <p>"CashNova changed the way I manage money. Super simple and effective!"</p>
                <h6 className="mt-3 mb-0">- Sahil</h6>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 testimonial-card">
                <p>"I finally feel in control of my finances thanks to this amazing app."</p>
                <h6 className="mt-3 mb-0">- Navya</h6>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 testimonial-card">
                <p>"Highly recommend for anyone who wants a modern approach to budgeting."</p>
                <h6 className="mt-3 mb-0">- Trisha</h6>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 testimonial-card">
                <p>"Easy to use and helps me save more every month!"</p>
                <h6 className="mt-3 mb-0">- Mohit</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About CashNova Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/cashnova.webp"
              alt="About CashNova"
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: 320 }}
            />
          </div>
          <div className="col-md-6 text-md-start text-center">
            <h2 className="fw-bold mb-3" style={{ color: "#185a9d" }}>What is CashNova?</h2>
            <p className="lead text-secondary mb-3">
              CashNova is your all-in-one platform for managing personal finances with ease and confidence.
              Whether you want to budget smarter, track expenses, or set financial goals, CashNova gives you the tools to succeed.
            </p>
            <ul className="list-unstyled text-secondary mb-4">
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Simple, intuitive interface</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Powerful analytics and charts</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Secure and private by design</li>
            </ul>
            <a href="/about" className="btn btn-outline-primary px-4">Learn More</a>
          </div>
        </div>
      </div>

      {/* Motivation/Stats Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-people-fill text-primary fs-1 mb-2"></i>
              <h3 className="fw-bold mb-1">10,000+</h3>
              <p className="mb-0 text-secondary">Active Users</p>
            </div>
          </div>
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-wallet2 text-success fs-1 mb-2"></i>
              <h3 className="fw-bold mb-1">₹50Cr+</h3>
              <p className="mb-0 text-secondary">Managed Budgets</p>
            </div>
          </div>
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-bar-chart-line text-warning fs-1 mb-2"></i>
              <h3 className="fw-bold mb-1">98%</h3>
              <p className="mb-0 text-secondary">User Satisfaction</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-shield-lock text-info fs-1 mb-2"></i>
              <h3 className="fw-bold mb-1">100%</h3>
              <p className="mb-0 text-secondary">Data Privacy</p>
            </div>
          </div>
        </div>
      </div>
     

     

      {/* Add this style for hover effect */}
      <style>
        {`
        .gallery-img-wrapper {
          overflow: hidden;
          border-radius: 1.25rem;
          box-shadow: 0 4px 24px rgba(30, 90, 157, 0.08);
          background: #fff;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .gallery-img-wrapper:hover {
          box-shadow: 0 8px 32px rgba(26,188,156,0.13), 0 2px 8px rgba(24,90,157,0.10);
          transform: scale(1.02);
        }
        .gallery-img {
          cursor: url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/search.svg") 16 16, pointer;
          border-radius: 1rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .why-card, .testimonial-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .why-card:hover, .testimonial-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 8px 32px rgba(26,188,156,0.13), 0 2px 8px rgba(24,90,157,0.10);
          z-index: 2;
        }
        .section-title {
          font-weight: 700;
          background: linear-gradient(90deg, #1abc9c 0%, #185a9d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }
        `}
      </style>
    </div>
  );
}