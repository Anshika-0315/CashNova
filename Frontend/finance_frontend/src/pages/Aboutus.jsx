import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';




const teamMembers = [
  {
    name: "Anshika",
    role: "Founder & Developer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWnNhD73n5ZaoIfWmUpknL0E3YFCHgSbllhI693_rpkmTIT4bkgAjXUIUy7cqfGJeL0NQ&usqp=CAU=Anshika",
    desc: "Anshika sparked the vision for our CashNova and brings it to life with her Django and React expertise. From crafting APIs to shaping our mission, she’s dedicated to empowering your financial journey. Her favorite envelope: 'Giving Back.'",
  },
  {
    name: "Kiran",
    role: "UI/UX & Graphic Designer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp-b0373G0o4OD1CIQVnVQVI2AP5NnOXtsTl2f_Uozb6hQYEz9nVM_feQlpXnic5iLg-I&usqp=CAU=Kiran",
    desc: "Kiran transforms budgeting into a visual delight with intuitive Bootstrap 5 interfaces and custom graphics. Her designs make every click a step toward financial clarity. Her favorite envelope: 'Vacations.'",
  },
  {
    name: "Anjali",
    role: "Project Manager & QA Engineer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkVUz5Q_6NCdD0-44nfhmpMq0Dcs-hzNL7KO6Qv9kRHukAhnC04vHjf38zqOQSe5vJRw&usqp=CAU=Anjali",
    desc: "Anjali keeps our project on track and flawless, orchestrating sprints and rigorously testing React components and Django APIs. Her precision ensures a seamless budgeting experience. Her favorite envelope: 'Fun Money.'",
  },
  {
    name: "Riya",
    role: "User Support Specialist & Content Writer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvOQXLWaDK1LZoTwW3rC4yLvfFz317EBo4ng&s=Riya",
    desc: "Riya crafts clear guides and heartfelt support to help you master our tracker. Her words and care make budgeting feel like a breeze. Her favorite envelope: 'Groceries.'",
  },
];

export default function AboutUs() {


	const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth && auth.user) {
      navigate('/budgets');
    } else {
      navigate('/login');
    }

	};

	return (
		<div className="bg-light">
			{/* Hero Banner */}
			<section className="position-relative overflow-hidden py-5 text-center text-white" style={{ background: "linear-gradient(90deg, #1abc9c 0%, #185a9d 100%)" }}>
  <div className="container position-relative" style={{ zIndex: 2 }}>
    <h1 className="display-3 fw-bold mb-3">About CashNova</h1>
    <p className="lead mb-4" style={{ maxWidth: 700, margin: "0 auto" }}>
      Empowering you to take control of your financial future with clarity,
      confidence, and community.
    </p>
  </div>
  {/* Decorative SVG shape at the bottom */}
  {/* <svg viewBox="0 0 1440 120" width="100%" height="120" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
    <path
      d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z"
      fill="#f8fafc"
      fillOpacity="1"
    />
  </svg> */}
</section>

			{/* What is CashNova - Modern Card with Icon and Accent Bar */}
<section
  className="w-100 py-5"
  style={{
    background: "linear-gradient(120deg, #f6f8fc 60%, #e8faf6 100%)",
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
  }}
>
  <div className="container">
    <div className="row justify-content-center align-items-center">
      <div className="col-lg-10 mx-auto">
        <div
          className="d-flex flex-column flex-md-row align-items-center rounded-4 shadow-lg p-4 p-md-5"
          style={{
            background: "#fff",
            borderLeft: "8px solid #1abc9c",
            boxShadow: "0 8px 32px rgba(26,188,156,0.10), 0 2px 8px rgba(24,90,157,0.10)",
            minHeight: 320,
          }}
        >
          {/* Icon/Illustration */}
          <div className="me-md-5 mb-4 mb-md-0 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                background: "linear-gradient(135deg, #1abc9c 0%, #185a9d 100%)",
                width: 90,
                height: 90,
                boxShadow: "0 4px 16px rgba(30,90,157,0.10)",
              }}
            >
              <i className="bi bi-cash-coin text-white fs-1"></i>
            </div>
          </div>
          {/* Content */}
          <div className="flex-fill text-center text-md-start">
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#185a9d",
                fontSize: "2.2rem",
                letterSpacing: "0.5px",
              }}
            >
              What is CashNova?
            </h2>
            <p className="lead mb-4" style={{ color: "#185a9d", fontWeight: 500 }}>
              <strong>CashNova</strong> is your modern digital budgeting companion, blending the proven envelope method with smart analytics and a beautiful, intuitive interface.
              Take control of your money, set goals, and build your financial future with confidence.
            </p>
            <div className="row justify-content-center mb-4">
              <div className="col-md-4 col-12 mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                  <span>Intuitive, easy-to-use design</span>
                </div>
              </div>
              <div className="col-md-4 col-12 mb-2 mb-md-0">
                <div className="d-flex align-items-center">
                  <i className="bi bi-bar-chart-line-fill text-primary me-2 fs-5"></i>
                  <span>Insightful analytics & charts</span>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-lock-fill text-info me-2 fs-5"></i>
                  <span>Secure & private by design</span>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

			{/* Mission & Vision */}
			<section className="container py-5">
				<div className="row g-5">
					<div className="col-md-6">
						<div className="bg-white rounded-4 shadow-sm p-4 h-100">
							<h3 className="fw-bold mb-3" style={{ color: "#1abc9c" }}>
								Our Mission
							</h3>
							<p>
								At <strong>CashNova</strong>, our mission is to make financial wellness
								accessible to everyone. We believe that budgeting should be simple,
								effective, and tailored to real life. By combining the time-tested
								envelope system with user-friendly digital solutions, we strive to help
								people align their spending with their values, reduce financial stress,
								and build a brighter financial future. We are committed to privacy,
								security, and continuous improvement—so you can focus on what matters
								most.
							</p>
						</div>
					</div>
					<div className="col-md-6">
						<div className="bg-white rounded-4 shadow-sm p-4 h-100">
							<h3 className="fw-bold mb-3" style={{ color: "#185a9d" }}>
								Our Vision
							</h3>
							<p>
								We believe that financial well-being is a cornerstone of a fulfilling life, and our goal is to provide you with the tools, insights, and support you need to achieve your financial aspirations.
                We're building more than just a tracker; we're creating a platform that simplifies complex financial concepts, encourages mindful spending, and celebrates every step of your financial journey.                Ultimately, our vision is to help you build a secure and prosperous future, one informed financial decision at a time.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="container py-5">
  <h2 className="fw-bold text-center mb-5" style={{ color: "#185a9d" }}>
    Meet the Team
  </h2>
  <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
    {teamMembers.map((member, idx) => (
      <div className="col" key={idx}>
        <div className="d-flex align-items-center p-4 h-100 flex-md-row flex-column text-md-start text-center">
          <img
            src={member.img}
            alt={member.name}
            className="rounded-circle shadow"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              marginRight: "2rem",
              marginBottom: "0",
            }}
          />
          <div className="flex-grow-1 ms-md-4 mt-md-0 mt-3">
            <h5 className="fw-bold mb-1">{member.name}</h5>
            <h6 className="text-muted mb-2">{member.role}</h6>
            <p className="mb-0">{member.desc}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

			{/* Why We Love What We Do */}
			<section className="py-5" style={{ backgroundColor: "#e8faf6" }}>
				<div className="container">
					<h2 className="fw-bold text-center mb-4" style={{ color: "#1abc9c" }}>
						Why We Love What We Do
					</h2>
					<div className="row justify-content-center">
						<div className="col-lg-8">
							<p className="fs-5 text-center">
								More than a handful of times, couples have told us CashNova saved their
								marriage. One time someone told us CashNova “made their year.” Then
								there are the thousands of people who are sticking to their budget for
								the first time because CashNova actually works for their everyday life.
							</p>
							<p className="fs-5 text-center">
								Your stories encourage, motivate, and push us forward. Keep ’em coming.
							</p>
							<p className="fs-5 text-center">We’re all ears.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features Our Users Love */}
<section className="py-5" style={{ background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)" }}>
  <div className="container">
    <h2 className="fw-bold text-center mb-5" style={{ color: "#185a9d" }}>
      Features Our Users Love
    </h2>
    <div className="row g-4 justify-content-center">
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#e8faf6" }}>
            <i className="bi bi-wallet2 fs-2 text-success"></i>
          </div>
          <h5 className="fw-bold mb-2">Categorized Budgeting</h5>
          <p className="mb-0 text-secondary">Organize your money into custom envelopes for every need—simple, visual, and effective.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#f0f6fa" }}>
            <i className="bi bi-graph-up-arrow fs-2 text-primary"></i>
          </div>
          <h5 className="fw-bold mb-2">Insightful Analytics</h5>
          <p className="mb-0 text-secondary">Track spending, visualize trends, and get actionable insights to improve your finances.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#eafaf1" }}>
            <i className="bi bi-shield-lock fs-2 text-info"></i>
          </div>
          <h5 className="fw-bold mb-2">Secure & Private</h5>
          <p className="mb-0 text-secondary">Your data is encrypted and protected with industry-leading security standards.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#fdf6e3" }}>
            <i className="bi bi-bell-fill fs-2 text-warning"></i>
          </div>
          <h5 className="fw-bold mb-2">Smart Reminders</h5>
          <p className="mb-0 text-secondary">Never miss a bill or budget update with customizable reminders and alerts.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#f6e8fa" }}>
            <i className="bi bi-flag fs-2 text-danger"></i>
          </div>
          <h5 className="fw-bold mb-2">Goal Tracking</h5>
          <p className="mb-0 text-secondary">Set savings goals and track your progress visually to stay motivated.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center feature-card">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" style={{ width: 60, height: 60, background: "#e8fafd" }}>
            {/* Use a calendar with a repeat/arrow icon for recurring payments */}
            <i className="bi bi-calendar2 fs-2 text-primary"></i>
          </div>
          <h5 className="fw-bold mb-2">Recurring Payments</h5>
          <p className="mb-0 text-secondary">
            Easily automate your bills and subscriptions—set once and let CashNova handle the rest, so you never miss a payment.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

			{/* Call to Action */}
			<section className="container py-5 text-center">
				<div className="bg-white rounded-4 shadow-sm p-5">
					<h2 className="fw-bold mb-3" style={{ color: "#185a9d" }}>
						Ready to Start Your Journey?
					</h2>
					<p className="lead mb-4">
						Join thousands of users who trust CashNova to help them achieve their
						financial goals.
					</p>
					<a
  onClick={handleGetStarted}
  className="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
  style={{
    background: "linear-gradient(90deg,rgb(18, 88, 164) 0%,rgb(116, 225, 216) 100%)",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    letterSpacing: "1px",
    transition: "background 0.3s, box-shadow 0.3s"
  }}
  onMouseOver={e => {
    e.currentTarget.style.background = "linear-gradient(90deg, rgb(116, 225, 216) 0%, rgb(18, 88, 164) 100%)";
    e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,188,156,0.13), 0 2px 8px rgba(24,90,157,0.10)";
  }}
  onMouseOut={e => {
    e.currentTarget.style.background = "linear-gradient(90deg,rgb(18, 88, 164) 0%,rgb(116, 225, 216) 100%)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  Get Started
</a>
				</div>
			</section>

			
		</div>
	);
}