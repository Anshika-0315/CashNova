import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-white pt-3 pb-3 mt-0"
      style={{
        background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
      }}
    >
      {/* <div className="text-center pt-4 pb-0">
        <h2 className="fw-bold">Ready to Take Control of Your Money?</h2>
        <p className="mb-4">
          Join thousands of smart users improving their financial lives every day.
        </p>
      </div> */}
      <div className="container">
        <div className="row text-start">
          <div className="col-md-3 mb-4">
            <h4 className="fw-bold">
              <a href="/" className="text-white text-decoration-none">
                <i className="bi bi-cash-coin me-2"></i>CashNova
              </a>
            </h4>
            <p>Budget well. Live smart.</p>
            <p>
              "Say goodbye to spreadsheets—budget smarter on web and mobile."
            </p>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Explore</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="about" className="text-white text-decoration-none">
                  Features
                </a>
              </li>
              <li>
                <a href="contact" className="text-white text-decoration-none">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Get Started</h5>
            <ul className="list-unstyled">
              <li>
                <a href="register" className="text-white text-decoration-none">
                  Sign Up
                </a>
              </li>
              <li>
                <a href="login" className="text-white text-decoration-none">
                  Log In
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Help</h5>
            <ul className="list-unstyled">
              <li>
                <a href="faq" className="text-white text-decoration-none">
                  FAQs
                </a>
              </li>
              <li>
                <a href="contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
              <li>
                <a href="/contact#email" className="text-white text-decoration-none">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center border-top border-white pt-2 small">
          <div className="mb-2">
            {/* Social Media Icons */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2"
            >
              <i className="bi bi-instagram fs-4"></i>
            </a>
            <a
              href="mailto:cashnova.budget@gmail.com"
              className="text-white mx-2"
            >
              <i className="bi bi-envelope-fill fs-4"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2"
            >
              <i className="bi bi-facebook fs-4"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white mx-2"
            >
              <i className="bi bi-twitter-x fs-4"></i>
            </a>
          </div>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} CashNova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}