
import mongoose from "mongoose";
import { systemRoles } from "../../utils/systemRoles.js";
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 15,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        //required: true,
        // min: 18,
        // max: 99,
        // validate: {
        //     validator: function (value) {
        //         return /^[1-9][0-9]*$/.test(value);
        //     },
        //     message: 'Age must be a positive integer.'
        // }
    },
    phone: [String],
    addresses: [String],
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(systemRoles),
        default: systemRoles.user
    }, 
    code: String,
    passwordChangeAt: Date

},
    {
        versionKey: false,
        timestamps: true
    })

const userModel = mongoose.model("user", userSchema)

export default userModel
