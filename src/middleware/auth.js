import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";


export const auth = () => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers
      if (!token) {
        return res.status(200).json({ msg: "token not found" })
      }
      if (!token.startsWith(process.env.bearKey)) {
        return res.status(200).json({ msg: "token is not valid" })
      }
      const newToken = token.split(process.env.bearKey)[1]
      if (!newToken) {
        return res.status(200).json({ msg: "new token is not valid" })
      }
      const decoded = jwt.verify(newToken, process.env.signatureKey)
      if (!decoded?.id) {
        return res.status(200).json({ msg: "invalid payload" })
      }
      const user = await userModel.findById(decoded.id)
      if (!user) {
        return res.status(200).json({ msg: "user not updated" })
      }
      // console.log(parseInt(user.passwordChangeAt.getTime()/1000))
      // console.log(decoded.iat);
      if(parseInt(user?.passwordChangeAt?.getTime()/1000) > decoded.iat){
        return res.status(403).json({ msg: "token is expired please log in again" })

      }
      req.user = user
      next()
    } catch (err) {
      return res.status(200).json({ msg: "catch error", err })
    }


  }
}


// export const auth = async (req,res,next)=>{
//     const {token} = req.headers
//     if(!token){
//         res.status(200).json({msg:"invalid token"})
//     }
//     const decoded = jwt.verify(token,"ahmed")
//     console.log(decoded);
//     const user = await userModel.findOne({email: decoded.email})
//     if(!user){
//       return  res.status(200).json({msg:"invalid user"})
//     }
//     req.user = user
//     next()
// }