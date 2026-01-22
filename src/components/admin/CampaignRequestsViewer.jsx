import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FaCheckCircle, FaTimesCircle, FaFilePdf, FaEye, FaSpinner } from 'react-icons/fa';

const CampaignRequestsViewer = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // id of request being processed

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/campaign-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch campaign requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toUpperCase()} this request? This will notify the user via email.`)) return;

        setActionLoading(id);
        try {
            const res = await api.put(`/campaign-requests/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                toast.success(`Request ${status} successfully`);
                // Update local state
                setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending} capitalize`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Requested Campaigns</h2>
            
            {requests.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No campaign requests found.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-8">
                    {requests.map((req) => (
                        <Card key={req._id} className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/60 bg-card rounded-xl">
                            {/* Card Header with Status Color Indicator */}
                            <div className={`h-1.5 w-full ${
                                req.status === 'approved' ? 'bg-green-500' : 
                                req.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-400'
                            }`} />
                            
                            <CardContent className="p-0">
                                <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                                    
                                    {/* Main Content Area */}
                                    <div className="flex-1 space-y-8">
                                        
                                        {/* Header Section: Patient & Status */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <h3 className="text-2xl font-bold text-foreground">
                                                        {req.patientName}
                                                    </h3>
                                                    <StatusBadge status={req.status} />
                                                </div>
                                                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                                    <span>{req.age} years old</span>
                                                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                                    <span className="font-medium text-foreground">{req.disease}</span>
                                                </p>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Requested On</p>
                                                 <p className="text-sm font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Grid Info Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl border border-border/40">
                                            
                                            {/* Column 1: Applicant & Contact */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 block">Applicant Details</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {req.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">{req.name}</p>
                                                            <p className="text-sm text-muted-foreground">{req.number}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 block">Email Address</label>
                                                    <p className="text-sm font-medium break-all">{req.userId?.email || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Column 2: Financials & Location */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 block">Amount Needed</label>
                                                    <p className="text-2xl font-bold text-foreground">₹{req.amount}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 block">Resident Location</label>
                                                    <p className="text-sm font-medium leading-relaxed">{req.address}</p>
                                                </div>
                                            </div>

                                            {/* Full Width: Bank Details */}
                                            <div className="md:col-span-2 pt-2 border-t border-border/40 mt-2">
                                                 <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">Banking Information</label>
                                                 <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                                     <div><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{req.bankName}</span></div>
                                                     <div><span className="text-muted-foreground">A/C No:</span> <span className="font-mono font-medium bg-background px-2 py-0.5 rounded border border-border/50">{req.accountNumber}</span></div>
                                                     <div><span className="text-muted-foreground">IFSC:</span> <span className="font-mono font-medium">{req.ifscCode}</span></div>
                                                     <div><span className="text-muted-foreground">Beneficiary:</span> <span className="font-medium">{req.accountHolderName}</span></div>
                                                 </div>
                                            </div>
                                        </div>

                                        {/* Documents Section */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <FaFilePdf className="text-red-500" /> Submitted Documents
                                            </h4>
                                            
                                            {(!req.documents || req.documents.length === 0) ? (
                                                <div className="text-sm text-muted-foreground italic pl-6">No documents attached.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {req.documents.map((doc, idx) => (
                                                        <div key={idx} className="group relative bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <span className="font-medium text-sm truncate pr-2" title={doc.documentName}>{doc.documentName}</span>
                                                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{doc.documentUrl?.length || 0} files</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {doc.documentUrl?.map((url, uIdx) => (
                                                                    <a 
                                                                        key={uIdx} 
                                                                        href={url} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 hover:border-primary/40 rounded py-1.5 transition-colors"
                                                                    >
                                                                        <FaEye size={12} /> View
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar: Actions */}
                                    <div className="w-full lg:w-64 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                                        
                                        <div className="lg:sticky lg:top-6 space-y-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Review Action</h4>
                                                
                                                {req.status === 'pending' ? (
                                                    <div className="space-y-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                            disabled={actionLoading === req._id}
                                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                                                        >
                                                            {actionLoading === req._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle className="group-hover:scale-110 transition-transform" />}
                                                            Approve Request
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                            disabled={actionLoading === req._id}
                                                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
                                                        >
                                                            {actionLoading === req._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle className="group-hover:text-red-700 transition-colors" />}
                                                            Reject Request
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`p-4 rounded-lg text-center border ${
                                                        req.status === 'approved' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                                                    }`}>
                                                        <div className="font-semibold mb-1 capitalize flex items-center justify-center gap-2">
                                                            {req.status === 'approved' ? <FaCheckCircle /> : <FaTimesCircle />}
                                                            {req.status}
                                                        </div>
                                                        <p className="text-xs opacity-80">This request has been processed.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <p className="mb-1"><strong>Note:</strong> Approving will trigger an automated email to the applicant. Funds are not transferred automatically.</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignRequestsViewer;
