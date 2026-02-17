'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4002/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

interface CartItem {
  productId: Product;
  quantity: number;
  variant?: { size?: string; color?: string };
}

interface Cart {
  _id?: string;
  items: CartItem[];
  sessionId?: string;
  subtotal?: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [billingSame, setBillingSame] = useState(true);
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostal, setBillingPostal] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const sessionId = localStorage.getItem('guestSessionId');
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: 'include',
        headers: sessionId ? { 'X-Session-Id': sessionId } : {},
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data);
      console.log('Cart loaded:', data);
      if (data.items?.length > 0) {
        const subtotal = data.items.reduce((sum: number, item: CartItem) => sum + ((item.productId?.price || 0) * item.quantity), 0);
        fetchShippingQuote(subtotal);
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingQuote = async (subtotal: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/quote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal }),
      });
      const data = await response.json();
      setShippingCost(data.shippingCost || 0);
    } catch (err) {
      console.error('Failed to fetch shipping quote:', err);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phone || !shippingAddress || !city || !postalCode || !country) {
      setError('Please fill in all required fields');
      return;
    }

    if (!cart) {
      setError('Cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      const sessionId = localStorage.getItem('guestSessionId');

      const checkoutData = {
        customer: {
          fullName,
          email,
          phone,
          shippingAddress: `${shippingAddress}, ${city}, ${postalCode}, ${country}`,
          billingAddress: billingSame ? '' : `${billingAddress}, ${billingCity}, ${billingPostal}`,
        },
        couponCode: couponCode || undefined,
        paymentMethod,
      };

      console.log('Sending checkout data:', JSON.stringify(checkoutData, null, 2));

      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { 'X-Session-Id': sessionId } : {}),
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Checkout error response:', errData);
        throw new Error(errData.error || errData.message || 'Checkout failed');
      }

      const order = await response.json();
      localStorage.setItem('orderData', JSON.stringify(order));
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Different flows based on payment method
      if (paymentMethod === 'cash') {
        // Show success message for cash on delivery
        setSuccess(true);
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = `/confirmation?orderRef=${order.orderRef}`;
        }, 2000);
      } else {
        // Redirect to payment page for card payment
        window.location.href = `/payment?orderId=${order._id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12">Loading...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="text-center">Your cart is empty. <Link href="/shop">Continue shopping</Link></p>
      </div>
    );
  }

  // Show success state for cash on delivery
  if (success) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <Card className="border-[#C6A87D]/20 bg-card">
          <CardContent className="space-y-6 text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-foreground">Order Confirmed</h2>
              <p className="text-muted-foreground">Your order has been placed successfully.</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Payment will be collected upon delivery. Redirecting to confirmation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum: number, item: CartItem) => sum + ((item.productId?.price || 0) * item.quantity), 0);
  const total = subtotal + shippingCost;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Checkout
        </p>
        <h1 className="text-3xl text-foreground">Guest Checkout</h1>
      </div>

      <form onSubmit={handleCheckout} className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">
              {error}
            </div>
          )}

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Contact
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name *</Label>
                  <Input
                    id="full-name"
                    placeholder="Alexandra Bloom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="alexandra@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 010-2030"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Shipping Address
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="125 Blossom Avenue"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code *</Label>
                  <Input
                    id="postal"
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Billing Address
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="billing-same"
                  checked={billingSame}
                  onCheckedChange={(checked) => setBillingSame(checked as boolean)}
                />
                <Label htmlFor="billing-same">Same as shipping</Label>
              </div>
              {!billingSame && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="billing-address">Address</Label>
                    <Input
                      id="billing-address"
                      placeholder="125 Blossom Avenue"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-city">City</Label>
                    <Input
                      id="billing-city"
                      placeholder="New York"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-postal">Postal Code</Label>
                    <Input
                      id="billing-postal"
                      placeholder="10001"
                      value={billingPostal}
                      onChange={(e) => setBillingPostal(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Payment Method
              </p>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="card" id="pay-card" />
                  <Label htmlFor="pay-card">Credit or Debit Card</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="cash" id="pay-cash" />
                  <Label htmlFor="pay-cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-[#C6A87D]/20 bg-card">
            <CardContent className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Promo Code
              </p>
              <div className="space-y-2">
                <Label htmlFor="coupon">Coupon Code (Optional)</Label>
                <Input
                  id="coupon"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit border-[#C6A87D]/20 bg-card lg:sticky lg:top-10">
          <CardContent className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Order Summary
            </p>
            <div className="space-y-3 text-sm">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span>{item.productId?.name} (x{item.quantity})</span>
                  <span>${((item.productId?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
            </div>
            <Separator className="bg-[#C6A87D]/30" />
            <div className="flex items-center justify-between text-base font-medium text-foreground">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Continue to Payment'}
            </Button>
            <p className="text-xs text-muted-foreground">
              No account required. Orders are processed as guests.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
