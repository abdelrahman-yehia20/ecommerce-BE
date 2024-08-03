import mongoose, { Types } from "mongoose";
const categorySchema = new mongoose.Schema({

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
        timestamps: true,
        toJSON: {virtuals: true}, // to displayed the virtual popluate in the response 
        toObject: {virtuals: true} // to displayed the virtual popluate in console.log
    })

    categorySchema.virtual("subCategories",{
        ref:"subCategory",
        localField:"_id",
        foreignField:"category"
    })

const categoryModel = mongoose.model("category", categorySchema)

export default categoryModel
