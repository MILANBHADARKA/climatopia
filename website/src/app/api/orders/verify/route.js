import crypto from 'crypto';
import { connectToDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDB();

    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Find transaction
      const transaction = await Transaction.findOne({
        razorpayOrderId: razorpay_order_id,
        userId
      });

      if (!transaction) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      // Update transaction
      await Transaction.findByIdAndUpdate(transaction._id, {
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed'
      });

      // Add credits to user
      await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $inc: { credits: transaction.credits },
          updatedAt: new Date()
        },
        { new: true }
      );

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await Transaction.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
