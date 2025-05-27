import crypto from 'crypto';
import { connectToDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendMail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


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

      const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Payment Successful</title>
  </head>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background-color: #f4f4f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <tr>
        <td style="background: linear-gradient(to right, #4f46e5, #6366f1); color: #ffffff; padding: 30px 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Payment Successful</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px 40px; color: #333;">
          <p style="margin: 0 0 20px;">Hello 👋,</p>
          <p style="margin: 0 0 20px;">
            We have received your payment of <strong>₹${transaction.amount}</strong>. Your transaction was successful and your account has been credited with <strong>${transaction.credits} credits</strong>.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin: 20px 0; width: 100%; font-size: 14px; background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; background-color: #f3f4f6;">Payment ID</td>
              <td style="padding: 12px 16px;">${razorpay_payment_id}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; background-color: #f3f4f6;">Order ID</td>
              <td style="padding: 12px 16px;">${razorpay_order_id}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; background-color: #f3f4f6;">Credits Added</td>
              <td style="padding: 12px 16px;">${transaction.credits}</td>
            </tr>
          </table>

          <p style="margin: 0 0 16px;">Thank you for trusting us! If you have any questions or need assistance, feel free to reply to this email.</p>

          <p style="margin: 32px 0 0;">Best regards,<br/><strong>The T3Coders Team</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          &copy; 2025 T3Coders. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>
`;


      //send mail to user
      await sendMail({
        to: user.emailAddresses[0].emailAddress,
        subject: 'Payment Successful',
        text: `Your payment of ${transaction.amount} has been successfully processed. You have received ${transaction.credits} credits.`,
        html
      });


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
