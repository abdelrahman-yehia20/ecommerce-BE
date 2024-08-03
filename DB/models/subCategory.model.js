import mongoose, { Types } from "mongoose";
const subCategorySchema = new mongoose.Schema({

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
    category:{
        type: Types.ObjectId,
        ref: "category",
       // required: true
    },
    customId: String

},
    {
        versionKey: false,
        timestamps: true
    })

    subCategorySchema.virtual("products",{
        ref:"products",
        localField:"_id",
        foreignField:"subCategory"
    })

const subCategoryModel = mongoose.model("subCategory", subCategorySchema)

export default subCategoryModel
