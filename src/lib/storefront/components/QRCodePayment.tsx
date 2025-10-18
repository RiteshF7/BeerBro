'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { QrCode, Smartphone, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import QRCodeLib from 'qrcode';

interface QRCodePaymentProps {
  total: number;
  onPaymentComplete: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  message: string;
  paymentId?: string;
}

export function QRCodePayment({ total, onPaymentComplete, onPaymentError }: QRCodePaymentProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'pending',
    message: 'Scan the QR code to complete payment'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Generate QR code data
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Create a unique payment ID
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment data - in a real app, this would be a payment URL or UPI ID
      const paymentData = {
        type: 'payment',
        amount: total,
        currency: 'USD',
        paymentId,
        merchant: 'BeerBro',
        timestamp: new Date().toISOString(),
        // In a real implementation, this would be a UPI payment URL or payment gateway URL
        upiId: 'beerbro@paytm', // Example UPI ID
        description: `Payment for BeerBro order - ${paymentId}`
      };

      // Generate QR code
      const qrDataUrl = await QRCodeLib.toDataURL(JSON.stringify(paymentData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeDataUrl(qrDataUrl);
      setPaymentStatus({
        status: 'pending',
        message: 'Scan the QR code with your payment app to complete the payment',
        paymentId
      });

      // Start payment status polling (simulated)
      startPaymentPolling(paymentId);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      onPaymentError('Failed to generate payment QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate payment status polling
  const startPaymentPolling = (paymentId: string) => {
    const pollInterval = setInterval(() => {
      // Simulate payment status changes
      const random = Math.random();
      
      if (random < 0.1) { // 10% chance of payment completion
        setPaymentStatus({
          status: 'completed',
          message: 'Payment completed successfully!',
          paymentId
        });
        onPaymentComplete(paymentId);
        clearInterval(pollInterval);
      } else if (random < 0.15) { // 5% chance of payment failure
        setPaymentStatus({
          status: 'failed',
          message: 'Payment failed. Please try again.'
        });
        onPaymentError('Payment failed. Please try again.');
        clearInterval(pollInterval);
      } else if (random < 0.2) { // 5% chance of processing
        setPaymentStatus({
          status: 'processing',
          message: 'Payment is being processed...'
        });
      }
    }, 3000); // Check every 3 seconds

    // Clear interval after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentStatus.status === 'pending' || paymentStatus.status === 'processing') {
        setPaymentStatus({
          status: 'expired',
          message: 'Payment session expired. Please generate a new QR code.'
        });
      }
    }, 300000); // 5 minutes
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && (paymentStatus.status === 'pending' || paymentStatus.status === 'processing')) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentStatus.status !== 'completed') {
      setPaymentStatus({
        status: 'expired',
        message: 'Payment session expired. Please generate a new QR code.'
      });
    }
  }, [timeLeft, paymentStatus.status]);

  // Generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <QrCode className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'processing':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          QR Code Payment
        </CardTitle>
        <CardDescription>
          Scan the QR code with your payment app to complete the transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Status */}
        <div className={`p-4 rounded-lg border flex items-center space-x-3 ${getStatusColor()}`}>
          {getStatusIcon()}
          <div>
            <p className="font-medium">{paymentStatus.message}</p>
            {paymentStatus.paymentId && (
              <p className="text-sm opacity-75">Payment ID: {paymentStatus.paymentId}</p>
            )}
          </div>
        </div>

        {/* QR Code Display */}
        {qrCodeDataUrl && paymentStatus.status !== 'completed' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <img 
                src={qrCodeDataUrl} 
                alt="Payment QR Code" 
                className="w-64 h-64"
              />
            </div>
            
            {/* Timer */}
            {timeLeft > 0 && (paymentStatus.status === 'pending' || paymentStatus.status === 'processing') && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Expires in: {formatTime(timeLeft)}</span>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                <Smartphone className="h-4 w-4 inline mr-1" />
                Open your payment app and scan this QR code
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">UPI</Badge>
                <Badge variant="outline">Paytm</Badge>
                <Badge variant="outline">PhonePe</Badge>
                <Badge variant="outline">Google Pay</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {(paymentStatus.status === 'failed' || paymentStatus.status === 'expired') && (
            <Button onClick={generateQRCode} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New QR Code
                </>
              )}
            </Button>
          )}
        </div>

        {/* Payment Amount */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="text-2xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
