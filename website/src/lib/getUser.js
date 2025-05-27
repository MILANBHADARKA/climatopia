import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "./mongodb";
import User from '@/models/User';
export async function getUser(req) {
  try {
    const {userId} = getAuth(req);
    if (!userId) {
      return null; // User is not authenticated
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return null; 
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Handle error gracefully
  }
}