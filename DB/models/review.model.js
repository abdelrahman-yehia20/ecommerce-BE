import mongoose, { Types } from "mongoose";
const reviewSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: [true, 'comment is required'],
        trim: true,
        minLength: 2,
    },
    rate:{
        type: Number,
        required : true,
        min: 1,
        max: 5
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    productId: {
        type: Types.ObjectId,
        ref: "product",
        required: true
    },
    orderId: {
        type: Types.ObjectId,
        ref: "order"
    },
     

},
    {
        versionKey: false,
        timestamps: true
    })

const reviewModel = mongoose.model("review", reviewSchema)

export default reviewModel
