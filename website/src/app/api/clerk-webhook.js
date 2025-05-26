// pages/api/clerk-webhook.js
import connect from '../../db';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(request) {
  const payload = await request.json();
  const headersList = headers();
  
  // Verify the webhook signature
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;
  
  try {
    const svixHeaders = {
      'svix-id': headersList.get('svix-id'),
      'svix-timestamp': headersList.get('svix-timestamp'),
      'svix-signature': headersList.get('svix-signature')
    };
    evt = wh.verify(JSON.stringify(payload), svixHeaders);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  const db = await connect();
  const usersCollection = db.collection('users');

  // Handle different event types
  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      // Upsert the user data
      await usersCollection.updateOne(
        { clerkId: evt.data.id },
        { $set: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          profileImage: evt.data.profile_image_url,
          updatedAt: new Date()
        }},
        { upsert: true }
      );
      break;
      
    case 'user.deleted':
      await usersCollection.deleteOne({ clerkId: evt.data.id });
      break;
  }

  return new Response('Webhook received', { status: 200 });
}