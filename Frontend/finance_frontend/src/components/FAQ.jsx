import React from "react";

const faqs = [
  {
    question: "What is CashNova?",
    answer:
      "CashNova is a modern personal finance platform that helps you budget, track expenses, and achieve your financial goals with ease and security."
  },
  {
    question: "Is CashNova free to use?",
    answer:
      "Yes! CashNova offers a free plan with all essential features. We also offer premium features for advanced users and businesses."
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up for a free account, set up your budget envelopes, and start tracking your expenses. Our intuitive dashboard will guide you every step of the way."
  },
  {
    question: "Is my financial data safe?",
    answer:
      "Absolutely. We use industry-leading encryption and security practices to keep your data private and secure. Your privacy is our top priority."
  },
  {
    question: "Can I use CashNova on my mobile device?",
    answer:
      "Yes! CashNova is fully responsive and works great on any device. Mobile apps are coming soon."
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team anytime via the Contact page or by emailing cashnova.budget@gmail.com. We're here to help!"
  },
  {
    question: "Can I import my data from other apps?",
    answer:
      "Yes, you can import your data using CSV files. Go to your dashboard and look for the import option under settings."
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click on the 'Forgot Password' link on the login page and follow the instructions to reset your password securely."
  }
];

export default function FAQ() {
  return (
    <div
      style={{
                minHeight: "100vh",
                minWidth: "100vw",
                background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)"
            }}
    >
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{
          background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Frequently Asked Questions
        </h1>
        <p className="lead text-secondary">
          Find answers to the most common questions about CashNova.
        </p>
      </div>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, idx) => (
          <div className="accordion-item mb-3 border-0 shadow-sm rounded-3" key={idx}>
            <h2 className="accordion-header" id={`heading${idx}`}>
              <button
                className={`accordion-button ${idx !== 0 ? "collapsed" : ""} fw-semibold`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${idx}`}
                aria-expanded={idx === 0 ? "true" : "false"}
                aria-controls={`collapse${idx}`}
                style={{
                  background: "#f8fafc",
                  color: "#185a9d",
                  fontSize: "1.15rem",
                  borderRadius: "1rem"
                }}
              >
                <i className="bi bi-question-circle me-2"></i>
                {faq.question}
              </button>
            </h2>
            <div
              id={`collapse${idx}`}
              className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
              aria-labelledby={`heading${idx}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body py-4 px-3">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}