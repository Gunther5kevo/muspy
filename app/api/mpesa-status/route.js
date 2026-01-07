// app/api/mpesa-status/route.js
import { NextResponse } from 'next/server';

// Import the payment statuses map from the callback handler
// In production, use a shared cache like Redis
const paymentStatuses = new Map();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing checkoutRequestId' },
        { status: 400 }
      );
    }

    // Check if we have a status for this checkout request
    const status = paymentStatuses.get(checkoutRequestId);

    if (!status) {
      // No status yet - payment still pending
      return NextResponse.json({
        status: 'pending',
        message: 'Payment is being processed',
      });
    }

    // Return the status
    return NextResponse.json(status);

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

// Alternative: Query M-Pesa API directly to check status
export async function POST(req) {
  try {
    const { checkoutRequestId } = await req.json();

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing checkoutRequestId' },
        { status: 400 }
      );
    }

    // This would query M-Pesa's STK Push Query API
    // Implementation depends on M-Pesa API documentation
    // For now, we'll just check our in-memory cache

    const status = paymentStatuses.get(checkoutRequestId);

    if (!status) {
      return NextResponse.json({
        status: 'pending',
        message: 'Payment is being processed',
      });
    }

    return NextResponse.json(status);

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}