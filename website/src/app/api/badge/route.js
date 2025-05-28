import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Badge from "@/models/Badge";

export async function GET() {
  await connectToDB();
  const badges = await Badge.find();
  return NextResponse.json(badges);
}

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, imageUrl, skillType } = body;

  await connectToDB();
  const badge = await Badge.create({ name, description, imageUrl, skillType });
  return NextResponse.json(badge);
}
