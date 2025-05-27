import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    receipt: { type: String, required: true },
    planType: { type: String, required: true }, // e.g., 'monthly', 'yearly'
},
    {
        timestamps: true
    });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
