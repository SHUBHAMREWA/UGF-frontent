import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, Plus, Search, Eye, Edit, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import EventForm from './EventForm';
import ExpenseForm from './ExpenseForm';
import DonationForm from './DonationForm';
import EventDetailsModal from './EventDetailsModal';
import ImageLoader from '../ImageLoader';
import './EventManagementCRM.css';

const EventManagementCRM = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalDonations: 0, totalExpenses: 0, netBalance: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    loadStats();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await api.get(`/event-management?${params}`);
      if (res.data.success) {
        setEvents(res.data.events || []);
      }
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/event-management/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [statusFilter, searchTerm]);

  const handleCreateEvent = async (formData) => {
    try {
      const res = await api.post('/event-management', formData);
      if (res.data.success) {
        toast.success('Event created successfully');
        setShowEventForm(false);
        loadEvents();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleAddExpense = async (eventId, formData) => {
    try {
      const res = await api.post(`/event-management/${eventId}/expenses`, formData);
      if (res.data.success) {
        toast.success('Expense added successfully');
        setShowExpenseForm(false);
        loadEvents();
        loadStats();
        if (selectedEvent?._id === eventId) {
          loadEventDetails(eventId);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleAddDonation = async (eventId, formData) => {
    try {
      const res = await api.post(`/event-management/${eventId}/donations`, formData);
      if (res.data.success) {
        toast.success('Donation added successfully');
        setShowDonationForm(false);
        loadEvents();
        loadStats();
        if (selectedEvent?._id === eventId) {
          loadEventDetails(eventId);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add donation');
    }
  };

  const loadEventDetails = async (id) => {
    try {
      const res = await api.get(`/event-management/${id}`);
      if (res.data.success) {
        setSelectedEvent(res.data.event);
      }
    } catch (error) {
      toast.error('Failed to load event details');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/event-management/${id}/status`, { status });
      if (res.data.success) {
        toast.success('Event status updated');
        loadEvents();
        if (selectedEvent?._id === id) {
          loadEventDetails(id);
        }
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredEvents = events.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !e.venue.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="event-management-crm">
      <div className="header">
        <div className="header-content">
          <div className="header-icon">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1>Event Management</h1>
            <p>SN Group Foundation CRM</p>
          </div>
        </div>
        <button onClick={() => setShowEventForm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span>Add New Event</span>
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-content">
            <p className="card-label">Total Events</p>
            <p className="card-value">{stats.totalEvents}</p>
          </div>
          <div className="card-icon bg-green-100">📅</div>
        </div>
        <div className="card">
          <div className="card-content">
            <p className="card-label">Total Funds Raised</p>
            <p className="card-value">{formatCurrency(stats.totalDonations)}</p>
          </div>
          <div className="card-icon bg-blue-100">💰</div>
        </div>
        <div className="card">
          <div className="card-content">
            <p className="card-label">Total Expenses</p>
            <p className="card-value">{formatCurrency(stats.totalExpenses)}</p>
          </div>
          <div className="card-icon bg-purple-100">💸</div>
        </div>
        <div className="card">
          <div className="card-content">
            <p className="card-label">Net Balance</p>
            <p className={`card-value ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.netBalance)}
            </p>
          </div>
          <div className="card-icon bg-orange-100">📊</div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button onClick={() => setActiveTab('events')} className={activeTab === 'events' ? 'active' : ''}>
            Events List
          </button>
        </div>

        <div className="filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <div className="search-box">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <ImageLoader size={100} text="Loading..." />
          </div>
        ) : (
          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Donations</th>
                  <th>Expenses</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => {
                  const balance = (event.totalDonations || 0) - (event.totalExpenses || 0);
                  return (
                    <tr key={event._id}>
                      <td>
                        <div className="event-info">
                          <div className="event-title">{event.title}</div>
                          <div className="event-subtitle">{event.mainMember}</div>
                        </div>
                      </td>
                      <td>{formatDate(event.startDate)}</td>
                      <td>
                        <span className={`status-badge status-${event.status}`}>
                          {event.status}
                        </span>
                      </td>
                      <td>{formatCurrency(event.totalDonations)}</td>
                      <td>{formatCurrency(event.totalExpenses)}</td>
                      <td className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(balance)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => loadEventDetails(event._id)} className="btn-view">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditingEvent(event); setShowEventForm(true); }} className="btn-edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
          onSubmit={handleCreateEvent}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          eventId={selectedEvent?._id}
          onClose={() => setShowExpenseForm(false)}
          onSubmit={handleAddExpense}
        />
      )}

      {showDonationForm && (
        <DonationForm
          eventId={selectedEvent?._id}
          onClose={() => setShowDonationForm(false)}
          onSubmit={handleAddDonation}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddExpense={() => setShowExpenseForm(true)}
          onAddDonation={() => setShowDonationForm(true)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default EventManagementCRM;

