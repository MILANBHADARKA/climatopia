import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectToDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET(request) {
    try{
        const {userId} = getAuth(request);

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        await connectToDB();

        const user = await clerkClient.users.getUser(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const userMongo = await User.findOne({ clerkId: userId });

        if (!userMongo) {
            return new Response(JSON.stringify({ error: "User not found in database" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const orders = await Transaction.find({ userId: userMongo.clerkId })
            .sort({ createdAt: -1 })
            .exec();

        if (!orders || orders.length === 0) {
            return new Response(JSON.stringify({ message: "No orders found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}   