import React, { useEffect, useState } from 'react';
import API from '../api/apidata';
import { Spinner } from 'react-bootstrap';

const ALERT_TYPE_COLORS = {
  warning: {
    border: "#facc15",
    bg: "#fef9c3",
    color: "#b45309",
    icon: "bi-exclamation-triangle-fill"
  },
  danger: {
    border: "#f87171",
    bg: "#fef2f2",
    color: "#991b1b",
    icon: "bi-exclamation-octagon-fill"
  },
  info: {
    border: "#38bdf8",
    bg: "#f0f9ff",
    color: "#0369a1",
    icon: "bi-info-circle-fill"
  },
  success: {
    border: "#4ade80",
    bg: "#f0fdf4",
    color: "#166534",
    icon: "bi-check-circle-fill"
  }
};

const Alerts = ({ onAlertChange }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await API.get('/api/alerts/');
      const formatted = res.data.map(a => ({ ...a, is_recurring: false }));
      setAlerts(prev => {
        const recurring = prev.filter(a => a.is_recurring);
        const merged = [...recurring, ...formatted];
        return merged;
      });
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = async (id) => {
    if (id.toString().startsWith('upcoming-')) {
      const recurringAlert = alerts.find(a => a.id === id);
      const recurringId = recurringAlert?.recurring_payment_id;
      if (recurringId) {
        await API.post(`/api/recurring-payments/${recurringId}/dismiss/`);
      }
      setAlerts(prev => prev.filter(a => a.id !== id));
      if (onAlertChange) onAlertChange();
    } else {
      await API.post(`/api/alerts/${id}/dismiss/`);
      setAlerts(prev => prev.filter(a => a.id !== id));
      if (onAlertChange) onAlertChange();
    }
  };

  const fetchUpcomingPayments = async () => {
    try {
      const res = await API.get('/api/recurring-payments/upcoming/');
      const upcoming = Array.isArray(res.data) ? res.data : [];
      const formatted = upcoming.map((p) => ({
        id: `upcoming-${p.id}`,
        recurring_payment_id: p.id,
        message: `<strong>${p.name}</strong> of ₹${p.amount} is due on <strong>${p.next_due_date}</strong> (${p.repeat_interval.toLowerCase()})`,
        type: 'warning',
        is_recurring: true,
        created_at: new Date().toISOString()
      }));
      setAlerts(prev => {
        const nonRecurring = prev.filter(a => !a.is_recurring);
        const merged = [...formatted, ...nonRecurring];
        return merged;
      });
    } catch (error) {
      console.error('Failed to fetch upcoming payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPayments();
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;

  return (
    <div className="container py-4"
      style={{
                minHeight: "100vh",
                minWidth: "100vw",
                background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)"
            }}
    >
      <h2
        className="mb-5 text-center"
        style={{
          fontWeight: 700,
          letterSpacing: "-1px",
          marginBottom: "2.5rem"
        }}
      >
        <i className="bi bi-bell-fill me-2 text-warning"></i>
        Alerts
      </h2>

      {alerts.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-emoji-smile" style={{ fontSize: 48, opacity: 0.3 }}></i>
          <div className="mt-2">No active alerts.</div>
        </div>
      ) : (
        <div className="row g-3">
          {alerts.map(a => {
            const type = ALERT_TYPE_COLORS[a.type] || ALERT_TYPE_COLORS.info;
            return (
              <div key={a.id} className="col-12 col-md-10 mx-auto">
                <div
                  className="d-flex align-items-start shadow-sm"
                  style={{
                    borderLeft: `6px solid ${type.border}`,
                    background: type.bg,
                    borderRadius: 12,
                    padding: "1.1rem 1.2rem",
                    marginBottom: 0,
                    boxShadow: "0 2px 12px #0001"
                  }}
                >
                  <div className="me-3 pt-1">
                    <i className={`bi ${type.icon}`} style={{ fontSize: 28, color: type.border }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ color: type.color, fontSize: 17, fontWeight: 600 }}>
                      <span dangerouslySetInnerHTML={{ __html: a.message }} />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary px-3 py-1"
                        style={{ borderRadius: 8, fontWeight: 500, fontSize: 15 }}
                        onClick={() => dismiss(a.id)}
                      >
                        Dismiss
                      </button>
                      <small className="text-muted ms-3" style={{ fontSize: 14 }}>
                        {new Date(a.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
