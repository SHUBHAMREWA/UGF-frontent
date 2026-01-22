import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroEditor from '../components/admin/HeroEditor';
import StatsEditor from '../components/admin/StatsEditor';
import TestimonialsEditor from '../components/admin/TestimonialsEditor';
import HeroStatsEditor from '../components/admin/HeroStatsEditor';
import VolunteersTable from '../components/admin/VolunteersTable';
import ProgramsEditor from '../components/admin/ProgramsEditor';
import EventsEditor from '../components/admin/EventsEditor';
import GalleryEditor from '../components/admin/GalleryEditor';
import BlogEditor from '../components/admin/BlogEditor';
// import DonationEditor from '../components/admin/DonationEditor';
import CampaignsEditor from '../components/admin/CampaignsEditor';
import CampaignRequestsViewer from '../components/admin/CampaignRequestsViewer'; // Imported
import CarouselEditor from '../components/admin/CarouselEditor';
import EmergencyContactManagement from '../components/admin/EmergencyContactManagement';
import AryaMitraEnquiryManagement from '../components/admin/AryaMitraEnquiryManagement';
import ImpactStoriesEditor from '../components/admin/ImpactStoriesEditor';
import ImportantUpdates from '../components/ImportantUpdates';
import AdminDashboardCRM from '../components/admin/AdminDashboardCRM';
import OfflineDonationsCRM from '../components/admin/OfflineDonationsCRM';
import TenderManagement from '../components/admin/TenderManagement';
import EventManagementCRM from '../components/admin/EventManagementCRM';
import api from '../utils/api';
import {
  BarChart3, Users, Image, Calendar, Newspaper, MessageSquare, Heart, DollarSign, UserCog, Database, AlertTriangle, Search, Bell, X, Target, ChevronDown, LayoutDashboard, FileText, TrendingUp, UserCircle, Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ImageLoader from '../components/ImageLoader';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'hero-stats';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [openGroup, setOpenGroup] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const dropdownRefs = useRef({});

  const tabGroups = [
    {
      id: 'overview',
      label: 'Dashboard & Analytics',
      icon: LayoutDashboard,
      items: [
        { key: 'hero-stats', label: 'Hero Statistics', icon: BarChart3 },
        { key: 'stats', label: 'Statistics', icon: BarChart3 }
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      items: [
        { key: 'blog', label: 'Blog Posts', icon: Newspaper },
        { key: 'gallery', label: 'Gallery', icon: Image },
        { key: 'carousel', label: 'Carousel', icon: Image },
        { key: 'impact-stories', label: 'Impact Stories', icon: Heart },
        { key: 'testimonials', label: 'Testimonials', icon: MessageSquare }
      ]
    },
    {
      id: 'fundraising',
      label: 'Fundraising & Donations',
      icon: TrendingUp,
      items: [
        { key: 'campaigns', label: 'Campaigns', icon: Target },
        { key: 'campaign-requests', label: 'Requested Campaigns', icon: FileText },
        { key: 'payments', label: 'Payments', icon: DollarSign },
        { key: 'offline-donations', label: 'Offline Donations', icon: Heart }
      ]
    },
    {
      id: 'people',
      label: 'People & Relationships',
      icon: UserCircle,
      items: [
        { key: 'users', label: 'Users', icon: Users },
        { key: 'VolunteersTable', label: 'Volunteers', icon: Users },
        { key: 'crm', label: 'CRM System', icon: Database },
        { key: 'enquiries', label: 'WAERF Enquiries', icon: Search }
      ]
    },
    {
      id: 'operations',
      label: 'Programs & Operations',
      icon: Settings,
      items: [
        { key: 'programs', label: 'Programs', icon: BarChart3 },
        { key: 'events', label: 'Events', icon: Calendar },
        { key: 'event-management', label: 'Event Management CRM', icon: Calendar },
        { key: 'updates', label: 'Important Updates', icon: Bell },
        { key: 'emergency', label: 'WAERF', icon: AlertTriangle },
        { key: 'tenders', label: 'Tender Management', icon: FileText }
      ]
    }
  ];

  // Sync activeTab with URL params (only when URL changes externally)
  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
      // Find which group contains the active tab and open it
      const group = tabGroups.find(g => g.items.some(item => item.key === tabFromUrl));
      if (group) {
        setOpenGroup(group.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  // Update URL when tab changes
  const handleTabChange = (tabKey) => {
    console.log('Tab change clicked:', tabKey, 'Current activeTab:', activeTab); // Debug log
    setActiveTab(tabKey); // Update immediately for instant feedback
    setSearchParams({ tab: tabKey });
    // Close dropdown after a small delay to allow the click to register
    setTimeout(() => {
      setOpenGroup(null);
    }, 100);
  };

  // Toggle dropdown
  const toggleGroup = (groupId) => {
    console.log('Toggle group:', groupId, 'Current open:', openGroup);
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedInside = false;
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && dropdownRefs.current[key].contains(event.target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        setOpenGroup(null);
      }
    };

    // Use a small delay to allow click events to process first
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'payments') {
      setPaymentsLoading(true);
      setPaymentsError('');
      api.get('/payments/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setPayments(res.data.payments || []))
        .catch(() => setPaymentsError('Failed to load payment details'))
        .finally(() => setPaymentsLoading(false));
    }
    if (activeTab === 'users') {
      setUsersLoading(true);
      setUsersError('');
      api.get('/users/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setUsers(res.data || []))
        .catch(() => setUsersError('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  const filteredPayments = payments.filter(p => {
    // Date filter
    if (dateRange.from || dateRange.to) {
      const paymentDate = new Date(p.createdAt);
      
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (paymentDate < fromDate) return false;
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (paymentDate > toDate) return false;
      }
    }
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed' && p.status !== 'paid') return false;
      if (statusFilter === 'pending' && !['created', 'authorized', 'pending'].includes(p.status)) return false;
      if (statusFilter === 'failed' && p.status !== 'failed') return false;
    }
    return true;
  });

  const campaignTotals = {};
  filteredPayments.forEach(p => {
    const campaign = p.donation?.title || 'Unknown';
    if (!campaignTotals[campaign]) campaignTotals[campaign] = 0;
    campaignTotals[campaign] += p.amount;
  });
  const campaignChartData = Object.entries(campaignTotals).map(([name, amount]) => ({ name, amount }));

  const dayTotals = {};
  filteredPayments.forEach(p => {
    const day = new Date(p.createdAt).toLocaleDateString();
    if (!dayTotals[day]) dayTotals[day] = 0;
    dayTotals[day] += p.amount;
  });
  const dayChartData = Object.entries(dayTotals).map(([date, amount]) => ({ date, amount })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-foreground mb-3">Admin Dashboard</h2>
          <nav>
            <ul className="flex flex-wrap gap-2">
              {tabGroups.map(group => {
                const GroupIcon = group.icon;
                const isGroupActive = group.items.some(item => item.key === activeTab);
                const isOpen = openGroup === group.id;
                
                return (
                  <li key={group.id} className="relative" ref={el => dropdownRefs.current[group.id] = el}>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        isGroupActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <GroupIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{group.label}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg min-w-[200px] z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-2">
                          {group.items.map(item => {
                            const ItemIcon = item.icon;
                            const isActive = activeTab === item.key;
                            return (
                              <li key={item.key}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Button clicked for:', item.key);
                                    handleTabChange(item.key);
                                  }}
                                  className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${
                                    isActive
                                      ? 'bg-primary/10 text-primary font-medium'
                                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                  }`}
                                >
                                  <ItemIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm">{item.label}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Full Width Content Area */}
      <div className="w-full">
        <div className="p-4">
          {/* Debug: Show current active tab */}
          {activeTab === 'hero-stats' && <HeroStatsEditor />}
          {activeTab === 'stats' && <StatsEditor />}
          {activeTab === 'impact-stories' && <ImpactStoriesEditor />}
          {activeTab === 'testimonials' && <TestimonialsEditor />}
          {activeTab === 'VolunteersTable' && <VolunteersTable />}
          {activeTab === 'programs' && <ProgramsEditor />}
          {activeTab === 'events' && <EventsEditor />}
          {activeTab === 'event-management' && <EventManagementCRM />}
          {activeTab === 'gallery' && <GalleryEditor />}
          {activeTab === 'emergency' && <EmergencyContactManagement />}
          {activeTab === 'enquiries' && <AryaMitraEnquiryManagement />}
          {activeTab === 'carousel' && <CarouselEditor />}
          {activeTab === 'blog' && <BlogEditor />}
          {activeTab === 'campaigns' && <CampaignsEditor />}
          {activeTab === 'campaign-requests' && <CampaignRequestsViewer />}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">All Razorpay Payments</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Status Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'completed', 'pending', 'failed'].map(status => (
                          <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className="text-xs"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Date Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3 items-end">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">From</label>
                          <input
                            type="date"
                            value={dateRange.from}
                            onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
                            className="px-3 py-1.5 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">To</label>
                          <input
                            type="date"
                            value={dateRange.to}
                            onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
                            className="px-3 py-1.5 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDateRange({ from: '', to: '' })}
                        >
                          Clear
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Amount Collected per Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={campaignChartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} fontSize={11} />
                          <YAxis fontSize={11} />
                          <Tooltip formatter={v => formatCurrency(v)} />
                          <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Amount Collected per Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dayChartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" angle={-20} textAnchor="end" interval={0} height={60} fontSize={11} />
                          <YAxis fontSize={11} />
                          <Tooltip formatter={v => formatCurrency(v)} />
                          <Legend fontSize={11} />
                          <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {paymentsLoading ? (
                  <Card>
                    <CardContent className="py-12 text-center flex items-center justify-center">
                      <ImageLoader size={80} text="Loading payments..." />
                    </CardContent>
                  </Card>
                ) : paymentsError ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-destructive">{paymentsError}</p>
                    </CardContent>
                  </Card>
                ) : filteredPayments.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No payments found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Payment Details ({filteredPayments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Donor Name</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Email</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Phone</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Address</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Campaign</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Amount</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Status</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Payment ID</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Order ID</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPayments.map((p) => {
                              const donorName = p.user?.name || p.guestDonor?.name || 'Anonymous';
                              const donorEmail = p.user?.email || p.guestDonor?.email || '-';
                              const donorPhone = p.user?.mobileNumber || p.guestDonor?.phone || '-';
                              const donorAddress = p.guestDonor?.address || '-';
                              const getStatusDisplay = (status) => {
                                if (status === 'paid') return { label: 'Completed', class: 'bg-green-500/10 text-green-600' };
                                if (['created', 'authorized', 'pending'].includes(status)) return { label: 'Pending', class: 'bg-yellow-500/10 text-yellow-600' };
                                if (status === 'failed') return { label: 'Failed', class: 'bg-red-500/10 text-red-600' };
                                return { label: status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending', class: 'bg-muted text-muted-foreground' };
                              };
                              const statusInfo = getStatusDisplay(p.status);
                              return (
                                <tr key={p._id} className="border-b border-border hover:bg-muted/50">
                                  <td className="py-2 px-3 text-xs text-foreground">{donorName}</td>
                                  <td className="py-2 px-3 text-xs text-foreground">{donorEmail}</td>
                                  <td className="py-2 px-3 text-xs text-foreground">{donorPhone}</td>
                                  <td className="py-2 px-3 text-xs text-foreground max-w-xs truncate" title={donorAddress}>{donorAddress}</td>
                                  <td className="py-2 px-3 text-xs text-foreground">{p.donation?.title || 'General'}</td>
                                  <td className="py-2 px-3 text-xs font-medium text-foreground">{formatCurrency(p.amount)}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                      {statusInfo.label}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{p.paymentId || '-'}</td>
                                  <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{p.orderId || '-'}</td>
                                  <td className="py-2 px-3 text-xs text-muted-foreground">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">All Users</h3>
              {usersLoading ? (
                <Card>
                  <CardContent className="py-12 text-center flex items-center justify-center">
                    <ImageLoader size={80} text="Loading users..." />
                  </CardContent>
                </Card>
              ) : usersError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-destructive">{usersError}</p>
                  </CardContent>
                </Card>
              ) : users.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No users found.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">User Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Name</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Email</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Role</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u._id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-2 px-3 text-xs text-foreground">{u.name || '-'}</td>
                              <td className="py-2 px-3 text-xs text-foreground">{u.email || '-'}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                  {u.role || 'User'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {activeTab === 'crm' && <AdminDashboardCRM />}
          {activeTab === 'offline-donations' && <OfflineDonationsCRM />}
          {activeTab === 'updates' && <ImportantUpdates />}
          {activeTab === 'tenders' && <TenderManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
