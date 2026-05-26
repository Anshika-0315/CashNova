import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsEnvelopeAt, BsGeoAlt, BsClockHistory, BsSend, BsPerson, BsChatDots, BsBuilding } from "react-icons/bs";

// Simple loading bar component
const LoadingBar = ({ loading }) => (
  loading ? (
    <div style={{
      position: "fixed",
      top: 70,
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

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/contact/', formData);
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  // Scroll to #email if hash is present in URL
  useEffect(() => {
    if (window.location.hash === "#email") {
      const el = document.getElementById("email");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100); // Delay to ensure DOM is ready
      }
    }
  }, []);

  // Gradient background for the whole page
  const bgStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)",
    padding: "0",
  };

  // Card style
  const cardStyle = {
    borderRadius: 20,
    boxShadow: "0 8px 32px 0 rgba(60,72,88,0.13)",
    border: "none",
    background: "rgba(255,255,255,0.98)",
  };

  return (
    <div style={bgStyle}>
      {/* Loading Bar */}
      <LoadingBar loading={loading} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">

            {/* Heading */}
            <div className="text-center mb-5">
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(120deg, #6366f1 60%, #60a5fa 100%)",
                borderRadius: "50%",
                width: 70,
                height: 70,
                marginBottom: 10,
                boxShadow: "0 4px 16px #6366f133"
              }}>
                <BsChatDots style={{ color: "#fff", fontSize: 36 }} />
              </div>
              <h1 className="fw-bold" style={{ color: "#312e81", letterSpacing: "-1px" }}>Contact Us</h1>
              <p className="text-muted mb-0">Have questions, feedback, or need help?</p>
              <p className="text-muted">Fill out the form below and our team will get back to you soon!</p>
            </div>

            {/* Contact Form */}
            <div className="mb-4">
              <div className="card border-0 shadow-sm" style={cardStyle}>
                <div className="card-body">
                  {/* Centered and underlined "Send us a message" */}
                  <div className="d-flex flex-column align-items-center mb-5">
                    <h4 className="fw-semibold mb-2" style={{ color: "#6366f1", textAlign: "center" }}>
                      <BsSend style={{ marginRight: 8, color: "#6366f1" }} />
                      Send us a message
                    </h4>
                    <div
                      style={{
                        width: "80%",
                        height: 4,
                        borderRadius: 4,
                        background: "linear-gradient(90deg, rgba(99,102,241,0) 0%, #6366f1 40%, #6366f1 60%, rgba(99,102,241,0) 100%)",
                        marginTop: 2,
                        marginBottom: 8,
                      }}
                    />
                  </div>
                  {loading && <div className="alert alert-info">Sending your message, please wait...</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <BsPerson style={{ marginRight: 6, color: "#6366f1" }} />
                        Your Name
                      </label>
                      <input type="text" className="form-control rounded-pill" id="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <BsEnvelopeAt style={{ marginRight: 6, color: "#60a5fa" }} />
                        Email address
                      </label>
                      <input type="email" className="form-control rounded-pill" id="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label fw-semibold">
                        <BsChatDots style={{ marginRight: 6, color: "#f59e42" }} />
                        Message
                      </label>
                      <textarea className="form-control rounded-4" id="message" rows="5" value={formData.message} onChange={handleChange} required style={{ resize: "vertical" }}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 py-2" style={{ fontWeight: 600, fontSize: 18 }} disabled={loading}>
                      <BsSend style={{ marginRight: 6, marginBottom: 2 }} />
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="mb-4"  id='email'>
              <div className="card border-0 shadow-sm" style={cardStyle}>
                <div className="card-body d-flex align-items-center">
                  <div style={{
                    background: "#e0e7ff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16
                  }}>
                    <BsEnvelopeAt style={{ color: "#6366f1", fontSize: 24 }} />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-1" style={{ color: "#6366f1" }}>Email</h5>
                    <p className="text-muted mb-0">cashnova.budget@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="mb-4">
              <div className="card border-0 shadow-sm" style={cardStyle}>
                <div className="card-body d-flex align-items-center">
                  <div style={{
                    background: "#dcfce7",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16
                  }}>
                    <BsClockHistory style={{ color: "#059669", fontSize: 24 }} />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-1" style={{ color: "#059669" }}>Office Hours</h5>
                    <p className="text-muted mb-0">Monday - Friday: 10:00 AM – 5:00 PM</p>
                    <p className="text-muted mb-0">Saturday: 10:00 AM – 1:00 PM</p>
                    <p className="text-muted mb-0">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="mb-4">
              <div className="card border-0 shadow-sm" style={cardStyle}>
                <div className="card-body d-flex align-items-start">
                  <div style={{
                    background: "#fee2e2",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}>
                    {/* Changed from BsGeoAlt to BsBuilding */}
                    <BsBuilding style={{ color: "#f87171", fontSize: 24 }} />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-1" style={{ color: "#f87171" }}>Our Office</h5>
                    <p className="text-muted mb-0">Guru Nanak College</p>
                    <p className="text-muted mb-0">Department Of Vocational Studies</p>
                    <p className="text-muted mb-0">Bank More, Dhanbad - 826001</p>
                    <p className="text-muted mb-0">Jharkhand, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="mb-4">
              <h4 className="text-center mb-3 fw-semibold" style={{ color: "#6366f1" }}>
                {/* Changed from BsBuilding to BsGeoAlt */}
                <BsGeoAlt style={{ marginRight: 8, marginBottom: 3, color: "#6366f1" }} />
                Our Location
              </h4>
              <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.246495129366!2d86.43035477532742!3d23.80208488599937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6bccd23df2fc5%3A0x92de689c90d6cb4f!2sGuru%20Nanak%20College%20(Women&#39;s%20Wing%20%26%20Department%20Of%20Vocational%20Studies)!5e0!3m2!1sen!2sin!4v1716375813541!5m2!1sen!2sin"
                  width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
