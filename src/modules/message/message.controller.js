import messageModel from "../../../DB/models/message.model.js"


export const addMessage = async (req, res, next)=>{

    const{content, receiverId} = req.body
    const message = await messageModel.create({content, receiverId: req.user.id})
    res.status(201).json({msg:"done", message})
}


export const updateMessage = async (req, res, next)=>{
    const {id}= req.params
    const{content} = req.body
    const message = await messageModel.findOneAndUpdate({_id:id, receiverId: req.user.id},{content},{new: true})
    if(!message){
        res.json({msg:"message not found or you are not authorized"})
    }
    res.status(200).json({msg:"done", message})
}


export const deleteMessage = async (req, res, next)=>{
    const {id}= req.params
   
    const message = await messageModel.findOneAndDelete({_id:id, receiverId: req.user.id},{new: true})
    if(!message){
        res.json({msg:"message not found or you are not authorized"})
    }
    res.status(200).json({msg:"done", message})
}

