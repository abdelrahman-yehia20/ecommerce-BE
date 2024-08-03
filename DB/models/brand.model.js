import mongoose, { Types } from "mongoose";
const brandSchema = new mongoose.Schema({

    name: {
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
        maxLength: 30,
        unique: true,
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
    customId: String

},
    {
        versionKey: false,
        timestamps: true
    })

const brandModel = mongoose.model("brand", brandSchema)

export default brandModel
