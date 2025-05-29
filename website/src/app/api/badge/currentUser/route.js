import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAllBadgesForUser } from "../badgeservice";
import { getUser } from "@/lib/getUser"
import axios from "axios";

export async function GET(request) {
  try {
    await connectToDB();

    let user = await getUser(request);
    console.log("User from getUser:", user);
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let userId = user._id;

    if (userId) {
      user = await User.findById(userId)
        .select("firstName lastName email metamaskAddress")
        .lean();
    }
    console.log("matamask User ID:", userId);


    if (!user.metamaskAddress) {
      return Response.json({ error: "metamaskAddress not found" }, { status: 404 });
    }
    const badges = await getAllBadgesForUser(user.metamaskAddress);
    console.log(badges)

    return Response.json({ success: true, user, badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return Response.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}
