import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
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
        return Response.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ metamaskAddress: user.metamaskAddress });
  } catch (error) {
    console.error('Failed to fetch metamaskAddress:', error);
    return NextResponse.json({ error: 'Failed to fetch metamaskAddress' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json(); 
    const { metamaskAddress } = body;

    if (!metamaskAddress) {
      return NextResponse.json({ error: 'MetaMask address is required' }, { status: 400 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.metamaskAddress = metamaskAddress;
    await user.save();
    console.log("Address saved!!" + user.metamaskAddress)
    return NextResponse.json({ success: true, message: 'MetaMask address saved successfully' });
  } catch (error) {
    console.error('Failed to save MetaMask address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
