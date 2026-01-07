'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { X, CreditCard, Smartphone } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// USD to KES exchange rate (update periodically)
const USD_TO_KES = 129.5;

// Card Payment Form (uses Stripe)
function CardPaymentForm({ booking, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const amountInKES = Math.round(booking.total_amount * USD_TO_KES);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet');
      return;
    }

    setProcessing(true);

    try {
      console.log('Creating payment intent...', { amount: amountInKES, bookingId: booking.id });
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInKES,
          bookingId: booking.id,
          paymentMethod: 'card'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      console.log('Payment intent created:', data);
      
      if (!data.clientSecret) {
        throw new Error('No client secret received');
      }

      const { clientSecret } = data;

      console.log('Confirming payment...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      console.log('Payment confirmation result:', { error, paymentIntent });

      if (error) {
        console.error('Payment error:', error);
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, updating database...');
        
        const { data: bookingData, error: updateError } = await Promise.race([
          supabase
            .from('bookings')
            .update({ payment_status: 'paid' })
            .eq('id', booking.id)
            .select(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000)
          )
        ]);

        if (updateError) {
          console.error('Booking update failed:', updateError);
          toast.error('Failed to update booking: ' + updateError.message);
          setProcessing(false);
          return;
        }

        console.log('Booking updated successfully:', bookingData);

        // Record transaction (non-blocking)
        supabase
          .from('transactions')
          .insert([{
            booking_id: booking.id,
            stripe_payment_id: paymentIntent.id,
            amount: amountInKES,
            currency: 'KES',
            payment_method: 'card',
            status: 'completed'
          }])
          .then(({ error }) => {
            if (error) console.error('Transaction insert failed (non-critical):', error);
            else console.log('Transaction recorded successfully');
          });

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
          Card Details
        </label>
        <div className="p-4 border rounded-xl" style={{ borderColor: '#E5E7EB' }}>
          <CardElement
            options={{
              hidePostalCode: false,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#2B0E3F',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#EF4444',
                },
              },
            }}
          />
        </div>
        <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
          Test card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123 | ZIP: 12345
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 rounded-xl font-medium transition-colors"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 btn-primary"
        >
          {processing ? 'Processing...' : `Pay KES ${amountInKES.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
}

// M-Pesa Payment Form (no Stripe needed)
function MpesaPaymentForm({ booking, onSuccess, onCancel }) {
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const amountInKES = Math.round(booking.total_amount * USD_TO_KES);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setProcessing(true);

    try {
      console.log('Initiating M-Pesa payment...', { amount: amountInKES, phoneNumber });
      
      const response = await fetch('/api/mpesa-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInKES,
          phoneNumber: phoneNumber,
          bookingId: booking.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('M-Pesa payment initiation failed:', errorData);
        throw new Error(errorData.error || 'Failed to initiate M-Pesa payment');
      }

      const data = await response.json();
      console.log('M-Pesa payment initiated:', data);

      toast.success('Check your phone for M-Pesa prompt');

      // Poll for payment status
      const checkPaymentStatus = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/mpesa-status?checkoutRequestId=${data.checkoutRequestId}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'completed') {
            clearInterval(checkPaymentStatus);
            
            // Update booking
            console.log('Payment succeeded, updating database...');
            const { data: bookingData, error: updateError } = await Promise.race([
              supabase
                .from('bookings')
                .update({ payment_status: 'paid' })
                .eq('id', booking.id)
                .select(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000)
              )
            ]);

            if (updateError) {
              console.error('Booking update failed:', updateError);
              toast.error('Failed to update booking: ' + updateError.message);
              setProcessing(false);
              return;
            }

            // Record transaction (non-blocking)
            supabase
              .from('transactions')
              .insert([{
                booking_id: booking.id,
                stripe_payment_id: statusData.transactionId,
                amount: amountInKES,
                currency: 'KES',
                payment_method: 'mpesa',
                status: 'completed'
              }])
              .then(({ error }) => {
                if (error) console.error('Transaction insert failed (non-critical):', error);
                else console.log('Transaction recorded successfully');
              });

            toast.success('Payment successful!');
            onSuccess();
          } else if (statusData.status === 'failed') {
            clearInterval(checkPaymentStatus);
            toast.error('M-Pesa payment failed or cancelled');
            setProcessing(false);
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkPaymentStatus);
        if (processing) {
          toast.error('Payment timeout. Please try again.');
          setProcessing(false);
        }
      }, 120000);

    } catch (error) {
      console.error('M-Pesa error:', error);
      toast.error(error.message || 'M-Pesa payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
          M-Pesa Phone Number
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
            className="w-full p-4 border rounded-xl pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: '#E5E7EB', color: '#2B0E3F' }}
            disabled={processing}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            +
          </div>
        </div>
        <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
          Enter phone number in format: 254712345678
        </p>
        {processing && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 animate-pulse" />
              Check your phone for M-Pesa prompt...
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 rounded-xl font-medium transition-colors"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={processing}
          className="flex-1 btn-primary"
        >
          {processing ? 'Waiting for payment...' : `Pay KES ${amountInKES.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
}

// Main Payment Modal Component
export default function PaymentModal({ booking, isOpen, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const amountInKES = Math.round(booking.total_amount * USD_TO_KES);
  const platformFeeInKES = Math.round(booking.platform_fee * USD_TO_KES);
  const baseAmountInKES = amountInKES - platformFeeInKES;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" style={{ color: '#6B7280' }} />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mb-4">
            {paymentMethod === 'card' ? (
              <CreditCard className="w-6 h-6 text-white" />
            ) : (
              <Smartphone className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
            Complete Payment
          </h2>
          <p style={{ color: '#6B7280' }}>
            Secure payment for your booking
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: '#2B0E3F' }}>
            Choose Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('mpesa')}
              className={`p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'mpesa' 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone 
                className="w-6 h-6 mx-auto mb-2" 
                style={{ color: paymentMethod === 'mpesa' ? '#16A34A' : '#6B7280' }}
              />
              <p className="text-sm font-medium" style={{ color: paymentMethod === 'mpesa' ? '#16A34A' : '#2B0E3F' }}>
                M-Pesa
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'card' 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard 
                className="w-6 h-6 mx-auto mb-2" 
                style={{ color: paymentMethod === 'card' ? '#6A0DAD' : '#6B7280' }}
              />
              <p className="text-sm font-medium" style={{ color: paymentMethod === 'card' ? '#6A0DAD' : '#2B0E3F' }}>
                Card
              </p>
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span style={{ color: '#6B7280' }}>Booking Amount:</span>
            <span className="font-semibold" style={{ color: '#2B0E3F' }}>
              KES {baseAmountInKES.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ color: '#6B7280' }}>Platform Fee:</span>
            <span className="font-semibold" style={{ color: '#2B0E3F' }}>
              KES {platformFeeInKES.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
            <span className="font-bold" style={{ color: '#2B0E3F' }}>Total:</span>
            <span className="text-xl font-bold" style={{ color: paymentMethod === 'mpesa' ? '#16A34A' : '#6A0DAD' }}>
              KES {amountInKES.toLocaleString()}
            </span>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: '#9CA3AF' }}>
            ≈ ${booking.total_amount} USD
          </p>
        </div>

        {/* Payment Forms */}
        {paymentMethod === 'card' ? (
          <Elements stripe={stripePromise}>
            <CardPaymentForm 
              booking={booking}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </Elements>
        ) : (
          <MpesaPaymentForm 
            booking={booking}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
}