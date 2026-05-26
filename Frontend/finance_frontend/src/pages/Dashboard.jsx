import React, { useEffect, useState, useContext } from 'react';
import API from '../api/apidata';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area,
  BarChart, Bar
} from 'recharts';

// --- Inline styles and SVG icons for enhanced UI ---
const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15', '#a78bfa', '#fb923c', '#34d399', '#f472b6'];

const dashboardBg = {
  minHeight: '100vh',
  background: "linear-gradient(90deg, #e8faf6 0%, #f6f8fc 100%)",
  paddingBottom: 40,
};

const card = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 4px 24px 0 rgba(60,72,88,0.08)',
  padding: '2rem 2rem 1.5rem 2rem',
  marginBottom: '2.5rem',
  transition: 'box-shadow 0.2s',
};

const cardHover = {
  boxShadow: '0 8px 32px 0 rgba(60,72,88,0.16)',
};

const sectionTitle = {
  fontSize: '1.3rem',
  fontWeight: 600,
  color: '#3730a3',
  marginBottom: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const statBox = {
  padding: '0.9rem 2.2rem',
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1.1rem',
  background: 'linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%)',
  color: '#312e81',
  boxShadow: '0 2px 8px 0 rgba(60,72,88,0.06)',
};

const statIncome = {
  ...statBox,
  background: 'linear-gradient(90deg, #d1fae5 0%, #f0fdf4 100%)',
  color: '#059669',
};

const statExpense = {
  ...statBox,
  background: 'linear-gradient(90deg, #fee2e2 0%, #fef2f2 100%)',
  color: '#dc2626',
};

const topCategory = {
  marginTop: '1.2rem',
  textAlign: 'center',
  fontSize: '1.1rem',
  fontWeight: 500,
  color: '#f59e42',
  background: '#fff7ed',
  borderRadius: 10,
  padding: '0.7rem 1.2rem',
  display: 'inline-block',
};

const filterBox = {
  background: '#f1f5f9',
  borderRadius: 12,
  padding: '1.2rem 1.5rem',
  marginBottom: '2rem',
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const dashboardTitle = {
  fontSize: '2.2rem',
  fontWeight: 700,
  letterSpacing: '-1px',
  color: '#312e81',
  marginBottom: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  justifyContent: 'center',
};

const logoStyle = {
  width: 48,
  height: 48,
  marginRight: 12,
  borderRadius: 12,
  boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)',
  background: 'white',
  padding: 4,
};

const iconStyle = { fontSize: 28, marginRight: 10 };

// SVG Logo (CashNova style)
const CashNovaLogo = () => (
  <svg style={logoStyle} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#4f46e5"/>
    <circle cx="24" cy="24" r="14" fill="#fff"/>
    <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#4f46e5" fontFamily="Segoe UI">₹</text>
  </svg>
);

// Section icons (updated for more relevant, non-pie, non-donut, non-3D icons)
const CategoryIcon = () => (
  <span style={{ ...iconStyle, fontSize: 32, marginRight: 10 }} role="img" aria-label="categories">🗂️</span>
);
const YearlyIcon = () => (
  <span style={{ ...iconStyle, fontSize: 32, marginRight: 10 }} role="img" aria-label="trend">📈</span>
);

const icons = {
  monthly: <span style={iconStyle} role="img" aria-label="calendar">📅</span>,
  annual: <span style={iconStyle} role="img" aria-label="calendar">📆</span>,
  pie: <CategoryIcon />, // For "Category-wise Breakdown for Selected Month"
  donut: <YearlyIcon />, // For "Category-wise Breakdown for Selected Year"
  bar: <span style={iconStyle} role="img" aria-label="bar">💸</span>,
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [monthlyData, setMonthlyData] = useState([]);
  const [annualData, setAnnualData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryYearData, setCategoryYearData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyTotals, setMonthlyTotals] = useState({ income: 0, expense: 0 });
  const [annualTotals, setAnnualTotals] = useState({ income: 0, expense: 0 });
  const [allTimeExpenseData, setAllTimeExpenseData] = useState([]);

  useEffect(() => {
    fetchMonthlyData();
    fetchAnnualData();
    fetchCategoryYearData();
    fetchCategoryData();
    fetchAllTimeExpenseData();
  }, [year, month]);

  const fetchMonthlyData = async () => {
    try {
      const res = await API.get(`/api/summary/daily_breakdown/?year=${year}&month=${month}`);
      const data = res.data;
      const chartData = data.map(item => ({
        date: `${item.day} ${new Date(year, month - 1).toLocaleString('default', { month: 'short' })}`,
        Income: item.income,
        Expense: item.expense
      }));
      setMonthlyData(chartData);

      const totalIncome = data.reduce((sum, item) => sum + (item.income || 0), 0);
      const totalExpense = data.reduce((sum, item) => sum + (item.expense || 0), 0);
      setMonthlyTotals({ income: totalIncome, expense: totalExpense });
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const fetchAnnualData = async () => {
    try {
      const res = await API.get(`/api/summary/monthly_breakdown/?year=${year}`);
      const data = res.data;
      const chartData = data.map(item => ({
        month: new Date(year, item.month - 1).toLocaleString('default', { month: 'short' }),
        Income: item.income,
        Expense: item.expense
      }));
      setAnnualData(chartData);

      const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
      setAnnualTotals({ income: totalIncome, expense: totalExpense });
    } catch (error) {
      console.error("Error fetching annual data:", error);
    }
  };

  const fetchCategoryYearData = async () => {
    try {
      const res = await API.get(`/api/summary/category_breakdown/?year=${year}`);
      const transformed = res.data.map(item => ({
        name: `${item.category__name} (${item.transaction_type})`,
        value: item.total_amount
      }));
      const hasData = transformed.reduce((sum, d) => sum + d.value, 0) > 0;
      setCategoryYearData(hasData ? transformed : []);
    } catch (error) {
      console.error("Error fetching yearly category data:", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await API.get(`/api/summary/category_breakdown/?year=${year}&month=${month}`);
      const transformed = res.data.map(item => ({
        name: `${item.category__name} (${item.transaction_type})`,
        value: item.total_amount
      }));
      const hasData = transformed.reduce((sum, d) => sum + d.value, 0) > 0;
      setCategoryData(hasData ? transformed : []);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchAllTimeExpenseData = async () => {
    try {
      const res = await API.get(`/api/summary/category_breakdown/`);
      const expenseData = res.data
        .filter(item => item.transaction_type === "EXPENSE")
        .reduce((acc, curr) => {
          const idx = acc.findIndex(e => e.category__name === curr.category__name);
          if (idx > -1) {
            acc[idx].total_amount += Number(curr.total_amount);
          } else {
            acc.push({
              category: curr.category__name,
              total_amount: Number(curr.total_amount)
            });
          }
          return acc;
        }, [])
        .filter(item => item.total_amount > 0)
        .sort((a, b) => b.total_amount - a.total_amount);
      setAllTimeExpenseData(expenseData);
    } catch (error) {
      console.error("Error fetching all-time expense data:", error);
    }
  };

  const renderNoDataMessage = () => (
    <div className="text-center text-muted py-5">
      <h5>🚫 No data available</h5>
      <p>Enter your transactions to get data visualizations.</p>
    </div>
  );

  // Helper to get top spending category for the selected month
  const getTopSpendingCategory = () => {
    if (!categoryData.length) return null;
    const expenses = categoryData.filter(item => item.name.toLowerCase().includes('expense'));
    if (!expenses.length) return null;
    const top = expenses.reduce((max, curr) => (curr.value > max.value ? curr : max), expenses[0]);
    return top;
  };

  return (
    <div style={dashboardBg}>
      <div className="container py-5">
        {/* Dashboard Title with Logo */}
        <div style={dashboardTitle}>
          <CashNovaLogo />
          <span>CashNova Finance Dashboard</span>
        </div>

        {/* Filters */}
        <div style={filterBox}>
          <div>
            <label className="fw-bold mb-1" style={{ color: '#6366f1' }}>
              <span role="img" aria-label="month">🗓️</span> Month
            </label>
            <select className="form-select" value={month} onChange={e => setMonth(+e.target.value)}>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="fw-bold mb-1" style={{ color: '#6366f1' }}>
              <span role="img" aria-label="year">📅</span> Year
            </label>
            <select className="form-select" value={year} onChange={e => setYear(+e.target.value)}>
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Monthly Income vs Expense */}
        <motion.div className="mb-5" style={card} whileHover={cardHover}>
          <div style={sectionTitle}>{icons.monthly} Monthly Income vs Expense</div>
          {monthlyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis interval={0} tickCount={10} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Income" stroke="#4ade80" strokeWidth={3} />
                  <Line type="monotone" dataKey="Expense" stroke="#f87171" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                <div style={statIncome}>
                  <span role="img" aria-label="income">💰</span> Total Income: ₹{monthlyTotals.income.toLocaleString()}
                </div>
                <div style={statExpense}>
                  <span role="img" aria-label="expense">💸</span> Total Expense: ₹{monthlyTotals.expense.toLocaleString()}
                </div>
              </div>
              <div style={{ ...topCategory, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1.2rem auto', width: 'fit-content' }}>
                {getTopSpendingCategory()
                  ? <>🔥 Highest Spending Category: <b>{getTopSpendingCategory().name.split(' (')[0]}</b> — ₹{getTopSpendingCategory().value.toLocaleString()}</>
                  : <>No expense data for this month.</>
                }
              </div>
            </>
          ) : renderNoDataMessage()}
        </motion.div>

        {/* Annual Income vs Expense */}
        <motion.div className="mb-5" style={card} whileHover={cardHover}>
          <div style={sectionTitle}>{icons.annual} Annual Income vs Expense</div>
          {annualData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={annualData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis interval={0} tickCount={10} />
                  <Tooltip />
                  <Legend
                    formatter={(value) => {
                      if (value === "Income") return <span style={{ color: "#60a5fa", fontWeight: 600 }}>Annual Income</span>;
                      if (value === "Expense") return <span style={{ color: "#f87171", fontWeight: 600 }}>Annual Expense</span>;
                      return value;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#incomeColor)"
                    activeDot={{ r: 6 }}
                    name="Annual Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#f87171"
                    fillOpacity={1}
                    fill="url(#expenseColor)"
                    activeDot={{ r: 6 }}
                    name="Annual Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                <div style={{
                  ...statIncome,
                  background: 'linear-gradient(90deg, #dbeafe 0%, #60a5fa22 100%)', // matches the blue income graph
                  color: '#2563eb'
                }}>
                  <span role="img" aria-label="income">💰</span> Total Income: ₹{annualTotals.income.toLocaleString()}
                </div>
                <div style={statExpense}>
                  <span role="img" aria-label="expense">💸</span> Total Expense: ₹{annualTotals.expense.toLocaleString()}
                </div>
              </div>
            </>
          ) : renderNoDataMessage()}
        </motion.div>

        {/* Category-wise Breakdown for Selected Month */}
        <motion.div className="mb-5" style={card} whileHover={cardHover}>
          <div style={sectionTitle}>{icons.pie} Category-wise Breakdown for Selected Month</div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {categoryData.map((entry, idx) => (
                    <Cell key={`cell-month-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : renderNoDataMessage()}
        </motion.div>

        {/* Category-wise Breakdown for Selected Year */}
        <motion.div className="mb-5" style={card} whileHover={cardHover}>
          <div style={sectionTitle}>{icons.donut} Category-wise Breakdown for Selected Year</div>
          {categoryYearData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={categoryYearData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {categoryYearData.map((entry, idx) => (
                    <Cell key={`cell-year-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : renderNoDataMessage()}
        </motion.div>

        {/* All-Time Top Expense Categories */}
        <motion.div className="mb-5" style={card} whileHover={cardHover}>
          <div style={sectionTitle}>{icons.bar} Top Spending Categories (All Time)</div>
          {allTimeExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={allTimeExpenseData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <XAxis type="number" tickFormatter={v => `₹${v.toLocaleString()}`} />
                <YAxis dataKey="category" type="category" width={150} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                <Bar dataKey="total_amount" fill="#f87171">
                  {allTimeExpenseData.map((entry, idx) => (
                    <Cell key={`cell-bar-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted py-5">
              <h5>🚫 No expense data available</h5>
              <p>Enter your expenses to see category-wise stats.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
