import React, { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiFolder,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiCalendar
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    today: { income: 0, expense: 0 },
    month: { income: 0, expense: 0 },
    year: { income: 0, expense: 0 },
    accounts: {
      cash: { balance: 0, totalIncome: 0, totalExpense: 0 },
      bank: { balance: 0, totalIncome: 0, totalExpense: 0 },
      upi: { balance: 0, totalIncome: 0, totalExpense: 0 },
      card: { balance: 0, totalIncome: 0, totalExpense: 0 }
    },
    counts: { totalDonors: 0, activeProjects: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      setDashboardData({
        today: { 
          income: { totalAmount: 25000, totalCount: 15 },
          expense: { totalAmount: 8500, totalCount: 8 }
        },
        month: { 
          income: { totalAmount: 125000, totalCount: 95 },
          expense: { totalAmount: 45000, totalCount: 32 }
        },
        year: { 
          income: { totalAmount: 850000, totalCount: 650 },
          expense: { totalAmount: 320000, totalCount: 280 }
        },
        accounts: {
          cash: { balance: 15000, totalIncome: 25000, totalExpense: 10000 },
          bank: { balance: 125000, totalIncome: 150000, totalExpense: 25000 },
          upi: { balance: 35000, totalIncome: 45000, totalExpense: 10000 },
          card: { balance: 25000, totalIncome: 30000, totalExpense: 5000 }
        },
        counts: { totalDonors: 1250, activeProjects: 8 }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'today':
        return dashboardData.today;
      case 'month':
        return dashboardData.month;
      case 'year':
        return dashboardData.year;
      default:
        return dashboardData.month;
    }
  };

  const periodData = getPeriodData();
  const netAmount = periodData.income.totalAmount - periodData.expense.totalAmount;

  const statsCards = [
    {
      title: 'Total Income',
      value: formatCurrency(periodData.income.totalAmount),
      count: periodData.income.totalCount,
      icon: FiDollarSign,
      iconClass: 'stat-card__icon--income',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(periodData.expense.totalAmount),
      count: periodData.expense.totalCount,
      icon: FiCreditCard,
      iconClass: 'stat-card__icon--expense',
      change: '+8.2%',
      changeType: 'negative'
    },
    {
      title: 'Net Amount',
      value: formatCurrency(netAmount),
      count: null,
      icon: FiActivity,
      iconClass: netAmount >= 0 ? 'stat-card__icon--income' : 'stat-card__icon--expense',
      change: netAmount >= 0 ? '+15.3%' : '-5.7%',
      changeType: netAmount >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Active Donors',
      value: dashboardData.counts.totalDonors.toLocaleString(),
      count: null,
      icon: FiUsers,
      iconClass: 'stat-card__icon--donors',
      change: '+5.1%',
      changeType: 'positive'
    }
  ];

  const accountCards = [
    {
      title: 'Cash Account',
      balance: formatCurrency(dashboardData.accounts.cash.balance),
      income: formatCurrency(dashboardData.accounts.cash.totalIncome),
      expense: formatCurrency(dashboardData.accounts.cash.totalExpense),
      icon: '💵'
    },
    {
      title: 'Bank Account',
      balance: formatCurrency(dashboardData.accounts.bank.balance),
      income: formatCurrency(dashboardData.accounts.bank.totalIncome),
      expense: formatCurrency(dashboardData.accounts.bank.totalExpense),
      icon: '🏦'
    },
    {
      title: 'UPI Account',
      balance: formatCurrency(dashboardData.accounts.upi.balance),
      income: formatCurrency(dashboardData.accounts.upi.totalIncome),
      expense: formatCurrency(dashboardData.accounts.upi.totalExpense),
      icon: '📱'
    },
    {
      title: 'Card Account',
      balance: formatCurrency(dashboardData.accounts.card.balance),
      income: formatCurrency(dashboardData.accounts.card.totalIncome),
      expense: formatCurrency(dashboardData.accounts.card.totalExpense),
      icon: '💳'
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your organization's financial performance</p>
        </div>
        
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your organization's financial performance</p>
          </div>
          <div className="period-selector">
            <div className="neo-pill-group">
              <button
                className={`neo-pill ${selectedPeriod === 'today' ? 'neo-pill--active' : ''}`}
                onClick={() => setSelectedPeriod('today')}
              >
                Today
              </button>
              <button
                className={`neo-pill ${selectedPeriod === 'month' ? 'neo-pill--active' : ''}`}
                onClick={() => setSelectedPeriod('month')}
              >
                This Month
              </button>
              <button
                className={`neo-pill ${selectedPeriod === 'year' ? 'neo-pill--active' : ''}`}
                onClick={() => setSelectedPeriod('year')}
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className={`stat-card__icon ${stat.iconClass}`}>
                <Icon />
              </div>
              <h3 className="stat-card__title">{stat.title}</h3>
              <p className="stat-card__value">{stat.value}</p>
              {stat.count && (
                <p className="stat-card__count">{stat.count} transactions</p>
              )}
              <div className={`stat-card__change stat-card__change--${stat.changeType}`}>
                {stat.changeType === 'positive' ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Balances */}
      <div className="content-card">
        <div className="content-card__header">
          <h2 className="content-card__title">Account Balances</h2>
          <div className="content-card__actions">
            <button className="neo-btn neo-btn--sm">
              <FiCalendar />
              View Details
            </button>
          </div>
        </div>
        <div className="content-card__body">
          <div className="accounts-grid">
            {accountCards.map((account, index) => (
              <div key={index} className="account-card">
                <div className="account-header">
                  <div className="account-icon">{account.icon}</div>
                  <h3 className="account-title">{account.title}</h3>
                </div>
                <div className="account-balance">{account.balance}</div>
                <div className="account-details">
                  <div className="account-detail">
                    <span className="detail-label">Income</span>
                    <span className="detail-value income">{account.income}</span>
                  </div>
                  <div className="account-detail">
                    <span className="detail-label">Expense</span>
                    <span className="detail-value expense">{account.expense}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="content-card">
        <div className="content-card__header">
          <h2 className="content-card__title">Recent Activity</h2>
          <div className="content-card__actions">
            <button className="neo-btn neo-btn--sm">
              View All
            </button>
          </div>
        </div>
        <div className="content-card__body">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon income">
                <FiDollarSign />
              </div>
              <div className="activity-content">
                <h4>New donation received</h4>
                <p>₹5,000 donation from John Doe via UPI</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
              <div className="activity-amount income">+₹5,000</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon expense">
                <FiCreditCard />
              </div>
              <div className="activity-content">
                <h4>Expense recorded</h4>
                <p>Office supplies purchase from Stationery Store</p>
                <span className="activity-time">1 hour ago</span>
              </div>
              <div className="activity-amount expense">-₹2,500</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon success">
                <FiUsers />
              </div>
              <div className="activity-content">
                <h4>New donor registered</h4>
                <p>Sarah Wilson joined as a new donor</p>
                <span className="activity-time">3 hours ago</span>
              </div>
              <div className="activity-amount">+1 donor</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon info">
                <FiFolder />
              </div>
              <div className="activity-content">
                <h4>Project updated</h4>
                <p>Education Fund project target increased</p>
                <span className="activity-time">5 hours ago</span>
              </div>
              <div className="activity-amount">Updated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
