'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4002/api';

interface Order {
  _id: string;
  orderRef: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    billingAddress?: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    variant?: { size?: string; color?: string };
  }>;
  subtotal: number;
  shippingCost: number;
  discount: number;
  loyaltyDiscount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const orderRef = searchParams.get('orderRef');
      if (!orderRef) {
        setError('No order reference found');
        setLoading(false);
        return;
      }

      // Try to get email/phone from localStorage
      const checkoutData = localStorage.getItem('checkoutData');
      let email = '';
      let phone = '';
      
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        email = data.customer?.email || '';
        phone = data.customer?.phone || '';
      }

      const params = new URLSearchParams();
      params.append('orderRef', orderRef);
      if (email) params.append('email', email);
      if (phone) params.append('phone', phone);

      const response = await fetch(`${API_BASE_URL}/orders?${params}`, {        credentials: 'include',        headers: {
          ...(localStorage.getItem('guestSessionId') && {
            'X-Session-Id': localStorage.getItem('guestSessionId')!,
          }),
        },
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const orderData = await response.json();
      setOrder(orderData);
      localStorage.removeItem('checkoutData');
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Order Confirmation
          </p>
          <h1 className="text-3xl text-foreground">Unable to Load Order</h1>
          <p className="text-red-600 mt-4">{error}</p>
          <Link href="/products">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    order.orderStatus === 'pending'
      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
      : order.orderStatus === 'shipped'
        ? 'bg-blue-50 border-blue-200 text-blue-800'
        : 'bg-green-50 border-green-200 text-green-800';

  const paymentStatusColor =
    order.paymentStatus === 'pending'
      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
      : 'bg-green-50 border-green-200 text-green-800';

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Thank You
        </p>
        <h1 className="text-3xl text-foreground">Order Confirmed</h1>
        <p className="text-muted-foreground">Order Reference: <strong>{order.orderRef}</strong></p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          {/* Order Status */}
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Order Status
              </p>
              <div className={`p-4 border rounded ${statusColor}`}>
                <p className="font-medium capitalize">{order.orderStatus}</p>
                <p className="text-sm mt-2">
                  {order.orderStatus === 'pending'
                    ? 'Your order is being prepared for shipment.'
                    : order.orderStatus === 'shipped'
                      ? 'Your order is on its way to you.'
                      : 'Your order has been delivered.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Payment Status
              </p>
              <div className={`p-4 border rounded ${paymentStatusColor}`}>
                <p className="font-medium capitalize">{order.paymentStatus}</p>
                {order.paymentMethod === 'cash' && order.paymentStatus === 'pending' && (
                  <p className="text-sm mt-2">
                    Payment will be collected on delivery.
                  </p>
                )}
                {order.paymentMethod === 'card' && order.paymentStatus === 'pending' && (
                  <p className="text-sm mt-2">
                    Your card will be charged shortly.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Delivery Address
              </p>
              <div className="space-y-3 text-sm">
                <p className="font-medium">{order.customer.fullName}</p>
                <p className="text-muted-foreground">{order.customer.shippingAddress}</p>
                <p className="text-muted-foreground">Phone: {order.customer.phone}</p>
                <p className="text-muted-foreground">Email: {order.customer.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Order Items
              </p>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.color && ` • Color: ${item.variant.color}`}
                        </p>
                      )}
                      <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-[#C6A87D]/20 bg-[#fdfbf9]">
            <CardContent className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Whats Next
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C6A87D]/20 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-muted-foreground">Check your email for order details</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C6A87D]/20 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-muted-foreground">Your order is being prepared</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C6A87D]/20 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Shipment</p>
                    <p className="text-muted-foreground">Track your order status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <Card className="h-fit border-[#C6A87D]/20 bg-card lg:sticky lg:top-10">
          <CardContent className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Order Summary
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.loyaltyDiscount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Loyalty Discount</span>
                  <span>-${order.loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <Separator className="bg-[#C6A87D]/30" />
            <div className="flex items-center justify-between text-base font-medium text-foreground">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3 mt-6">
              <Link href={`/track?orderRef=${order.orderRef}&email=${order.customer.email}`}>
                <Button variant="outline" className="w-full">
                  Track Order
                </Button>
              </Link>
              <Link href="/products">
                <Button className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to <strong>{order.customer.email}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
