export const  deleteFromDB = async (req,res,next)=>{

    if(req?.data){
        const{model, id}= req.data
        await model.deleteOne({_id: id})
    }

}