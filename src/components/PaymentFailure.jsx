import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, donationId, amount } = location.state || {};

  const handleRetry = () => {
    if (donationId) {
      navigate(`/donations/${donationId}`, { state: { retryAmount: amount } });
    } else {
      navigate('/donations');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-6">
      <div className="max-w-[600px] w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-base">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-6 space-y-3">
              {error && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Error Message</p>
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}
              {amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-foreground">
                    ₹{new Intl.NumberFormat('en-IN').format(amount)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your payment could not be processed. This could be due to:
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1 list-disc list-inside">
                <li>Insufficient funds in your account</li>
                <li>Network connectivity issues</li>
                <li>Payment gateway timeout</li>
                <li>Invalid payment details</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Please try again or contact support if the problem persists.
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
                onClick={handleRetry}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailure;

