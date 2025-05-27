import { connectToDB } from "@/lib/mongodb";
import crypto from "crypto";
import Transaction from "@/models/Transaction";
import path from "path";
import { sendMail } from "@/services/send-mail/sendMail";


export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
                                .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
                                .update(body)
                                .digest("hex");

                                
        if(expectedSignature !== signature) {
            return new Response(JSON.stringify({ error: "Invalid signature" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const event = JSON.parse(body);

        await connectToDB();

        if(event.event === "payment.captured") {
            const payment = event.payload.payment.entity;

            const order = await Transaction.findOneAndUpdate(
            { razorpayOrderId: payment.order_id, status: "pending" },
            {
                razorpayPaymentId: payment.id,
                status: "completed",
                amount: payment.amount,
            }
        ).populate(
            {
                path: "userId",
                select: "email firstName lastName profileImage"
            },
            {
                path: "subscriptionId",
                select: "name price description"
            })

            if(order){
                //mail send
                await sendMail({
                    to: order.userId.email,
                    subject: "Payment Successful",
                    text: `Your payment of ₹${order.amount / 100} for the subscription ${order.subscriptionId.name} was successful.`,
                    html: `<p>Dear ${order.userId.firstName},</p>
                           <p>Your payment of <strong>₹${order.amount / 100}</strong> for the subscription <strong>${order.subscriptionId.name}</strong> was successful.</p>
                           <p>Thank you for your purchase!</p>
                           <p>Best regards,</p>
                           <p>Your Company Name</p>`
                });

                
            }
    };
    } catch (error) {
        console.error("Error processing Razorpay webhook:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}