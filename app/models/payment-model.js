import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
    serviceRequestId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceRequest',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentReason: {
        type: String,
        enum: ['booking', 'service'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        required: true,
        default: 'pending'
    },
    amount : {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['card', 'upi', 'wallet', 'net banking'],
        required: true
    }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);
export default Payment;
