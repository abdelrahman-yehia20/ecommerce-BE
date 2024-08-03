import mongoose from "mongoose";
const messageSchema =new mongoose.Schema({

    content:{
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true
    }
})

const messageModel = mongoose.model("message", messageSchema)

export default messageModel