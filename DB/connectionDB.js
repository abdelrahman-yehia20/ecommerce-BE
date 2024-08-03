import mongoose from "mongoose";

const connectionDB = async ()=>{

    return await mongoose.connect(process.env.DB_URL_Online)
    .then(()=>{
        console.log(`database connected on ${process.env.DB_URL_Online}`)
    })
    .catch((err)=>{
        console.log({msg:"failed to connected to db", err})
    })
}


export default connectionDB