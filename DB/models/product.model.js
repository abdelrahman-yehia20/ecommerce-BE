
import mongoose, { Types } from "mongoose";
const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 30,
        unique: true,
        lowerCase: true,
    },
    slug:{
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 60,
        unique: true,
    },
    description:{
        type: String,
        trim: true,
        minLength: 2,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    image:{
        secure_url:String,
        public_id: String
    },
    coverImages:[{
        secure_url:String,
        public_id: String
    }],
    category:{
        type: Types.ObjectId,
        ref: "category",
       // required: true
    },
    subCategory:{
        type: Types.ObjectId,
        ref: "category",
       // required: true
    },
    brand:{
        type: Types.ObjectId,
        ref: "category",
       // required: true
    },
    customId: String,
    price:{
        type: Number,
        required : true,
        min: 1
    },
    discount:{
        type: Number,
        default : 1,
        min: 1,
        max: 100
    },
    subPrice:{
        type: Number,
        default : 1,
        min: 1,
    },
    stock:{
        type: Number,
        default : 1,
        required: true
    },
    rateAvg:{
        type: Number,
        default : 0,
    },
    rateNum:{
        type: Number,
        default : 0,
    }
    

},
    {
        versionKey: false,
        timestamps: true
    })

   

const productModel = mongoose.model("product", productSchema)

export default productModel
