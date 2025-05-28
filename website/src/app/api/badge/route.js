import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import {
  mintBadgeToUser,
  getAllBadgesForUser,
  checkUserHasBadge
} from "./badgeservice";
import User from "@/models/User";

//Get all badges for the logged-in user
export async function GET(req) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const badges = await getAllBadgesForUser(user.metamaskAddress);
    return NextResponse.json({ success: true, badges });
  } catch (err) {
    console.error("Error fetching badges:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//Mint a badge to the logged-in user
export async function POST(req) {
  try {
    await connectToDB();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { badgeName } = body;

    if (!badgeName || typeof badgeName !== "string") {
      return NextResponse.json({ error: "Invalid badge name" }, { status: 400 });
    }

    const alreadyHasBadge = await checkUserHasBadge(user.metamaskAddress, badgeName);
    if (alreadyHasBadge) {
      return NextResponse.json({ error: "User already has this badge" }, { status: 409 }); // 409 = Conflict
    }

    const result = await mintBadgeToUser(user.metamaskAddress, badgeName);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Error minting badge:", err);
    return NextResponse.json({ error: "Failed to mint badge" }, { status: 500 });
  }
}

