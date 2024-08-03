import mongoose, { Types } from "mongoose";
const cartSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
            productId : {type: Types.ObjectId, ref:"product",required: true},
            quantity : {type: Number, required: true}
    }]


},
    {
        versionKey: false,
        timestamps: true
    })

const cartModel = mongoose.model("cart", cartSchema)

export default cartModel
