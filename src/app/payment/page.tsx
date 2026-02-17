'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4002/api';

interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  variant?: { size?: string; color?: string };
}

interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Card form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    loadOrderSummary();
  }, []);

  const loadOrderSummary = async () => {
    try {
      const orderId = searchParams.get('orderId');
      if (!orderId) {
        setError('No order found. Please complete checkout first.');
        setLoading(false);
        return;
      }

      // Get the order data from localStorage
      const orderDataStr = localStorage.getItem('orderData');
      if (!orderDataStr) {
        setError('No order data found. Please complete checkout first.');
        setLoading(false);
        return;
      }

      const orderData = JSON.parse(orderDataStr);
      
      // Build summary from order data
      const summary: OrderSummary = {
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shippingCost: orderData.shippingCost || 0,
        discount: orderData.discount || 0,
        total: orderData.totalAmount || (orderData.subtotal || 0) + (orderData.shippingCost || 0) - (orderData.discount || 0),
      };

      setOrderSummary(summary);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate card details
    if (!cardName || !cardNumber || !expiry || !cvc) {
      setError('Please fill in all card details');
      return;
    }

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }

    if (cvc.length !== 3) {
      setError('CVC must be 3 digits');
      return;
    }

    try {
      setSubmitting(true);
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        throw new Error('No order found');
      }

      // Prepare card payment data
      const paymentData = {
        paymentMethod: 'card',
        cardDetails: {
          name: cardName,
          last4: cardNumber.slice(-4),
          // Never send full card details to backend in production
        },
      };

      console.log('Sending payment data:', JSON.stringify(paymentData, null, 2));

      // Call payment completion endpoint
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('guestSessionId') && {
            'X-Session-Id': localStorage.getItem('guestSessionId')!,
          }),
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Payment failed');
      }

      const order = await response.json();
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('orderData');
      setSuccess(true);

      // Redirect to confirmation
      setTimeout(() => {
        window.location.href = `/confirmation?orderRef=${order.orderRef}`;
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12">Loading order details...</div>;

  const total = orderSummary?.total || 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Payment
        </p>
        <h1 className="text-3xl text-foreground">Secure Payment</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handlePayment}>
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded">
                  Payment successful! Redirecting to confirmation...
                </div>
              )}

              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Card Details
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your card information to complete the payment.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name *</Label>
                  <Input
                    id="card-name"
                    placeholder="Alexandra Bloom"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number *</Label>
                  <Input
                    id="card-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiration *</Label>
                    <Input
                      id="expiry"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC *</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      type="password"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-6">
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Order Summary
              </p>
              <div className="space-y-2 text-sm">
                {orderSummary?.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${orderSummary?.subtotal.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>${orderSummary?.shippingCost.toFixed(2) || '0.00'}</span>
                </div>
                {(orderSummary?.discount ?? 0) > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${(orderSummary?.discount ?? 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Separator className="bg-[#C6A87D]/30" />
              <div className="flex items-center justify-between text-base font-medium text-foreground">
                <span>Total</span>
                <span>${orderSummary?.total.toFixed(2) || '0.00'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-[#fdfbf9]">
            <CardContent className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Payment Information
              </p>
              <p className="text-sm text-foreground">
                Your payment is encrypted and secure. We use industry-standard SSL technology to protect your card information.
              </p>
              <p className="text-xs text-muted-foreground">
                Support: For issues contact support@example.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
