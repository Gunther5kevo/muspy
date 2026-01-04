'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { X, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ booking, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: booking.total_amount,
          bookingId: booking.id,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            booking_id: booking.id,
            stripe_payment_id: paymentIntent.id,
            amount: booking.total_amount,
            status: 'completed'
          }]);

        if (transactionError) {
          console.error('Transaction error:', transactionError);
        }

        // Update booking payment status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ payment_status: 'paid' })
          .eq('id', booking.id);

        if (updateError) throw updateError;

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
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
              style: {
                base: {
                  fontSize: '16px',
                  color: '#2B0E3F',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
              },
            }}
          />
        </div>
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
          {processing ? 'Processing...' : `Pay $${booking.total_amount}`}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ booking, isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" style={{ color: '#6B7280' }} />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
            Complete Payment
          </h2>
          <p style={{ color: '#6B7280' }}>
            Secure payment for your booking
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span style={{ color: '#6B7280' }}>Booking Amount:</span>
            <span className="font-semibold" style={{ color: '#2B0E3F' }}>
              ${booking.total_amount - booking.platform_fee}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span style={{ color: '#6B7280' }}>Platform Fee:</span>
            <span className="font-semibold" style={{ color: '#2B0E3F' }}>
              ${booking.platform_fee}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
            <span className="font-bold" style={{ color: '#2B0E3F' }}>Total:</span>
            <span className="text-xl font-bold" style={{ color: '#6A0DAD' }}>
              ${booking.total_amount}
            </span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm 
            booking={booking} 
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}