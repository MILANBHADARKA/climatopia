import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectToDB } from "@/lib/mongodb.js";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { plans } from "@/types/plans";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
 
export async function POST(request) {
    try {
        await connectToDB();
        const { userId } = getAuth(request);

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await clerkClient.users.getUser(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const mongoUser = await User.findOne({ clerkId: userId });

        if (!mongoUser) {
            return new Response(JSON.stringify({ error: "User not found in database" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { planType } = await request.json();

        const plan = plans[planType];

        if (!plan) {
            return new Response(JSON.stringify({ error: "Invalid plan type" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const amount = plan.amount;  //amount in paise

        const options = {
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: mongoUser.clerkId,
                plan: planType, // Assuming planType is used as subscriptionId
            },
        }

        const order = await razorpay.orders.create(options);

        if (!order) {
            return new Response(JSON.stringify({ error: "Failed to create order" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const newTransaction = new Transaction({
            userId: mongoUser.clerkId,
            razorpayOrderId: order.id,
            amount: amount / 100,
            credits: plan.credits,
            status: "pending",
            receipt: order.receipt,
            planType: planType,
        });

        await newTransaction.save();

        return new Response(JSON.stringify({
            orderId: order.id,
            amount: order.amount,
            credits: plan.credits,
            receipt: order.receipt,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch (error) {
        console.log("Error creating order:", error);
        return new Response(JSON.stringify({ error: "Failed to create order" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}