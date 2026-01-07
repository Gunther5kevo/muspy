// app/api/mpesa-callback/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

// Store payment status in memory (in production, use Redis or database)
const paymentStatuses = new Map();

export async function POST(req) {
  try {
    const body = await req.json();
    
    console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

    const { Body } = body;
    
    if (!Body || !Body.stkCallback) {
      console.error('Invalid callback structure');
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 });
    }

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Store payment status for polling
    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', {
        amount,
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber
      });

      // Store successful payment status
      paymentStatuses.set(CheckoutRequestID, {
        status: 'completed',
        transactionId: mpesaReceiptNumber,
        amount,
        timestamp: new Date().toISOString(),
      });

      // You can also update the booking in the database here if you have the booking ID
      // For now, this will be handled by the status polling endpoint

    } else {
      // Payment failed
      console.log('Payment failed:', ResultDesc);
      
      paymentStatuses.set(CheckoutRequestID, {
        status: 'failed',
        reason: ResultDesc,
        timestamp: new Date().toISOString(),
      });
    }

    // Always return success to M-Pesa
    return NextResponse.json({ 
      ResultCode: 0,
      ResultDesc: 'Success' 
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    
    // Still return success to M-Pesa to avoid retries
    return NextResponse.json({ 
      ResultCode: 0,
      ResultDesc: 'Success' 
    });
  }
}

// Export the payment statuses map for access by the status endpoint
export { paymentStatuses };