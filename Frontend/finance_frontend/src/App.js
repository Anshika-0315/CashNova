import React , { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import API from "./api/apidata";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Alerts from "./components/Alerts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/Home";
import { getCSRFToken } from "./utils/csrf"; 
import EditProfile from "./components/EditProfile";
import Contact from "./pages/Contact";
import ChangePassword from "./components/ChangePassword";
import Aboutus from "./pages/Aboutus";
import Footer from "./components/Footer";
import Goals from "./pages/Goals";
import RecurringPayments from "./pages/RecurringPayments";
import FAQ from "./components/FAQ";

function AppContent({ alertCount, fetchAlertCount }) {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/register" && location.pathname !== "/login" && <Navbar alertCount={alertCount}/>}
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/alerts" element={<Alerts onAlertChange={fetchAlertCount} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/recurring-payments" element={<RecurringPayments />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default function App() {
  const [alertCount, setAlertCount] = useState(0);

  const fetchAlertCount = async () => {
    try {
      const alertsRes = await API.get("/api/alerts/");
      const alertsCount = Array.isArray(alertsRes.data) ? alertsRes.data.length : 0;
      const recurringRes = await API.get("/api/recurring-payments/upcoming/");
      const recurringCount = Array.isArray(recurringRes.data) ? recurringRes.data.length : 0;
      setAlertCount(alertsCount + recurringCount);
    } catch (err) {
      setAlertCount(0);
    }
  };

  useEffect(() => {
    getCSRFToken();
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent alertCount={alertCount} fetchAlertCount={fetchAlertCount} />
      </Router>
    </AuthProvider>
  );
}
