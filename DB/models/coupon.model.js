import mongoose, { Types } from "mongoose";
const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 30,
        unique: true,
        lowerCase: true,
    },
    amount:{
        type: Number,
        required : true,
        min: 1,
        max: 100
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    usedBy: [{
        type: Types.ObjectId,
        ref: "user",
        required: true
    }],
    fromDate:{
        type: Date ,
        required: [true, "fromdate is required"]
    },
    toDate:{
        type: Date ,
        required: [true, "todate is required"]
    }


},
    {
        versionKey: false,
        timestamps: true
    })

const couponModel = mongoose.model("coupon", couponSchema)

export default couponModel
