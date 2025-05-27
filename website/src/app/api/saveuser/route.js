// pages/api/clerk-webhook.js
import { connectDB } from '@/lib/mongodb';
import { Webhook } from 'svix';

import User from '@/models/User'; 
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request) {

  console.log('Received webhook request');

  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if(!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const headerlist =  headers();

  // These were all sent from the server
  const finalheaders = {
    "svix-id": headerlist.get('svix-id'),
    "svix-timestamp": headerlist.get('svix-timestamp'),
    "svix-signature": headerlist.get('svix-signature'),
  };

  const reqbody = await request.json();
  const body =  JSON.stringify(reqbody);

  const wh = new Webhook(secret);
  let evt = null;
  try {
      evt = await  wh.verify(body, finalheaders);
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if(evt){
    const type = evt.type;
    // if(type !== 'user.created' && type !== 'user.updated') {
    //   return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 });
    // }

    const data = evt.data;
    const userId = data.id;
    const email = data.email_addresses[0]?.email_address || null;
    const firstName = data.first_name || null;
    const lastName = data.last_name || null;
    const imageUrl = data.image_url || null;
    const externalId = data.external_id || null;
    const user = {
      clerkId :userId,
      email,
      firstName,
      lastName,
      imageUrl,
      externalId
    };

    try {
      await connectDB();
      // Upsert user in the database
      
      if(type === 'user.created') {
        await User.create(user);
      } else if(type === 'user.updated') {
        await User.updateOne({ clerkId: userId }, user, { upsert: true });
      }
     
      return NextResponse.json({ message: 'User saved successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error saving user:', error);
      return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'No event data found' }, { status: 400 });
}