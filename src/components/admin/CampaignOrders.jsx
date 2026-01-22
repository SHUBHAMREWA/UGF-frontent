import React, { useState, useEffect } from 'react';
import { X, Package, CheckCircle2, XCircle, Clock, Loader, Search, Filter } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import ImageLoader from '../ImageLoader';

const CampaignOrders = ({ campaignId, campaignTitle, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('paid'); // Default to show only paid orders
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (campaignId) {
      fetchOrders();
    }
  }, [campaignId, statusFilter, searchTerm, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (paymentStatusFilter !== 'all') {
        params.append('paymentStatus', paymentStatusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const url = campaignId === 'all' 
        ? `/donations/orders/all?${params.toString()}`
        : `/donations/${campaignId}/orders?${params.toString()}`;
      
      const response = await api.get(url);
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status, notes = '', googleDriveLink = '') => {
    try {
      const response = await api.put(`/donations/orders/${orderId}/status`, {
        status,
        notes,
        googleDriveLink
      });
      if (response.data.success) {
        toast.success('Order status updated successfully' + (status === 'fulfilled' ? ' and email sent to customer' : ''));
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(response.data.order);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Loader className="w-4 h-4" />;
      case 'fulfilled':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'fulfilled':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.customer.whatsapp.includes(searchTerm) ||
        order.payment.paymentId?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Orders - {campaignTitle}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone, or payment ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Order Status:</span>
                {['all', 'pending', 'in_progress', 'fulfilled', 'failed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Payment:</span>
                {['paid', 'pending', 'failed', 'all'].map((pStatus) => (
                  <Button
                    key={pStatus}
                    variant={paymentStatusFilter === pStatus ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentStatusFilter(pStatus)}
                  >
                    {pStatus === 'all' ? 'All Payments' : pStatus.charAt(0).toUpperCase() + pStatus.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 min-h-[300px]">
                <ImageLoader size={100} text="Loading orders..." />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="border cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{order.customer.name}</h4>
                            <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          {campaignId === 'all' && order.campaignId && (
                            <div className="text-xs text-primary mb-1">
                              <span className="font-medium">Campaign:</span> {order.campaignId.title || 'N/A'}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Email:</span> {order.customer.email}
                            </div>
                            <div>
                              <span className="font-medium">WhatsApp:</span> {order.customer.whatsapp}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> {formatCurrency(order.total)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Items:</span> {order.addOns.length} add-on{order.addOns.length !== 1 ? 's' : ''} | 
                            <span className="font-medium ml-2">Date:</span> {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes || '');
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === order.status && status !== 'fulfilled') {
      onClose();
      return;
    }
    
    if (status === 'fulfilled' && !googleDriveLink.trim()) {
      alert('Please provide a Google Drive link for fulfilled orders');
      return;
    }
    
    setUpdating(true);
    try {
      await onStatusUpdate(order._id, status, notes, googleDriveLink);
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Order Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium text-foreground">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium text-foreground">{order.customer.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">WhatsApp:</span>
                <span className="ml-2 font-medium text-foreground">{order.customer.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.addOns.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 border rounded-lg">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold text-primary text-lg">{formatCurrency(order.total)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="ml-2 font-medium text-foreground">{order.payment.paymentId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="ml-2 font-medium text-foreground capitalize">
                  {order.payment.status || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Order Date:</span>
                <span className="ml-2 font-medium text-foreground">{formatDate(order.createdAt)}</span>
              </div>
              {order.payment.paidAt && (
                <div>
                  <span className="text-muted-foreground">Paid At:</span>
                  <span className="ml-2 font-medium text-foreground">{formatDate(order.payment.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              {status === 'fulfilled' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Google Drive Link <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This link will be sent to the customer via email
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Add any notes about this order..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignOrders;

