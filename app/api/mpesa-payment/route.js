// app/api/mpesa-payment/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

// M-Pesa configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE, // Your business shortcode
  passkey: process.env.MPESA_PASSKEY, // Lipa Na M-Pesa Online Passkey
  callbackUrl: process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa-callback`,
  apiUrl: process.env.MPESA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke',
};
console.log('MPESA ENV CHECK:', {
  env: process.env.MPESA_ENV,
  apiUrl: MPESA_CONFIG.apiUrl,
  hasKey: !!process.env.MPESA_CONSUMER_KEY,
  hasSecret: !!process.env.MPESA_CONSUMER_SECRET,
  shortcode: MPESA_CONFIG.shortCode,
});

// Generate M-Pesa access token
async function getAccessToken() {
  try {
    const auth = Buffer.from(
      `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(
      `${MPESA_CONFIG.apiUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

// Generate timestamp in format YYYYMMDDHHmmss
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate password for M-Pesa
function generatePassword(shortCode, passkey, timestamp) {
  const data = `${shortCode}${passkey}${timestamp}`;
  return Buffer.from(data).toString('base64');
}

export async function POST(req) {
  try {
    const { amount, phoneNumber, bookingId } = await req.json();

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!phoneNumber || !/^254\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Use format: 254712345678' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Generate timestamp and password
    const timestamp = getTimestamp();
    const password = generatePassword(
      MPESA_CONFIG.shortCode,
      MPESA_CONFIG.passkey,
      timestamp
    );

    // Initiate STK Push
    const stkPushResponse = await axios.post(
      `${MPESA_CONFIG.apiUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: MPESA_CONFIG.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: MPESA_CONFIG.shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: MPESA_CONFIG.callbackUrl,
        AccountReference: `Booking${bookingId}`,
        TransactionDesc: `Payment for booking #${bookingId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('M-Pesa STK Push initiated:', {
      CheckoutRequestID: stkPushResponse.data.CheckoutRequestID,
      MerchantRequestID: stkPushResponse.data.MerchantRequestID,
    });

    return NextResponse.json({
      success: true,
      message: 'STK Push sent to phone',
      checkoutRequestId: stkPushResponse.data.CheckoutRequestID,
      merchantRequestId: stkPushResponse.data.MerchantRequestID,
    });
  } catch (error) {
    console.error('M-Pesa Payment Error:', error.response?.data || error);
    return NextResponse.json(
      { 
        error: error.response?.data?.errorMessage || error.message || 'M-Pesa payment failed',
        details: error.response?.data 
      },
      { status: 500 }
    );
  }
}