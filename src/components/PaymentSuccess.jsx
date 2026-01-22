import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import api from '../utils/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, donationTitle, paymentId, orderId, donationId } = location.state || {};
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptHtml, setReceiptHtml] = useState('');
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState('');

  const handleViewReceipt = async () => {
    if (!donationId) {
      navigate('/dashboard');
      return;
    }

    setLoadingReceipt(true);
    setReceiptError('');
    
    try {
      // Use public receipt endpoint for donation cards (no auth required)
      const response = await api.get(`/donations/${donationId}/receipt`);
      if (response.data.success && response.data.data?.html) {
        setReceiptHtml(response.data.data.html);
        setShowReceipt(true);
      } else {
        setReceiptError('Receipt not available yet. Please check your email or try again later.');
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setReceiptError(error.response?.data?.message || 'Failed to load receipt. Please try again later.');
    } finally {
      setLoadingReceipt(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-6">
      <div className="max-w-[600px] w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-base">
              Thank you for your generous donation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-6 space-y-3">
              {donationTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">Campaign</p>
                  <p className="text-lg font-semibold text-foreground">{donationTitle}</p>
                </div>
              )}
              {amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{new Intl.NumberFormat('en-IN').format(amount)}
                  </p>
                </div>
              )}
              {paymentId && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="text-sm font-mono text-foreground break-all">{paymentId}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your payment has been successfully processed. A confirmation email will be sent to your registered email address.
              </p>
              <p className="text-sm text-muted-foreground">
                Your contribution makes a real difference. Thank you for supporting our cause!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button
                onClick={handleViewReceipt}
                className="flex-1"
                disabled={loadingReceipt || !donationId}
              >
                <Receipt className="w-4 h-4 mr-2" />
                {loadingReceipt ? 'Loading...' : 'View Receipt'}
              </Button>
            </div>
            
            {receiptError && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                {receiptError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Donation Receipt</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div dangerouslySetInnerHTML={{ __html: receiptHtml }} />
            </div>
            <div className="p-4 border-t flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(receiptHtml);
                  printWindow.document.close();
                  printWindow.print();
                }}
                className="flex-1"
              >
                Print Receipt
              </Button>
              <Button
                onClick={() => setShowReceipt(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

