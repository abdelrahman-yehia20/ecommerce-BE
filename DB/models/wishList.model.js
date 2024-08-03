import mongoose, { Types } from "mongoose";
const wishListSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
            productId : {
                type: Types.ObjectId,
                ref:"product",
                required: true
                },
    }]

},
    {
        versionKey: false,
        timestamps: true
    })

const wishListModel = mongoose.model("wishList", wishListSchema)

export default wishListModel
