import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDB();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      user = new User({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        profileImage: clerkUser.imageUrl || null,
        credits: 50, // Initialize credits to 0
      });
      await user.save();
    }
    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectToDB();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $inc: { credits: -amount }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 0) {
      await User.findOneAndUpdate(
        { clerkId: userId },
        { $inc: { credits: amount } }
      );
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('Failed to deduct credits:', error);
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }
}