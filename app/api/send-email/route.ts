import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, productName, size, totalPrice, trackingCode } = body;

    // Log new orders to server console for testing
    console.log('--- 🎂 NEW ORDER RECEIVED 🎂 ---');
    console.log(`Tracking Code: ${trackingCode}`);
    console.log(`Customer: ${customerName} (${customerPhone})`);
    console.log(`Product: ${productName} - Size: ${size}`);
    console.log(`Total Price: MK ${totalPrice}`);
    console.log('----------------------------------');

    return NextResponse.json({ success: true, message: 'Order notification received' });
  } catch (error) {
    console.error('Error in send-email API route:', error);
    return NextResponse.json({ success: false, error: 'Failed to process notification' }, { status: 500 });
  }
}
