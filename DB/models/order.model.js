import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        title: { type: String, required: true },
        productId: { type: Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
    }],
    subPrice: { type: Number, required: true },
    couponId: { type: Types.ObjectId, ref: 'coupon' },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    status: {
        type: String,
        required: true,
        enum: ['placed', 'waitPayment', 'delivered', 'onWay', 'cancelled', 'rejected'],
        default: 'placed'
    },
    cancelledBy: {
        type: Types.ObjectId,
        ref: 'user',
    },
    reason: { type: String }

}, { timestamps: true, versionKey: false })

const orderModel = model('order', orderSchema)
export default orderModel