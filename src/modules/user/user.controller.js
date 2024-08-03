import userModel from "../../../DB/models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../service/sendEmail.js"
//import { signUpValidation } from "./user.validation.js"
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import { customAlphabet, nanoid } from 'nanoid'

// ------------------------------------- Sign up --------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, age, phone, addresses } = req.body;
    const userExist = await userModel.findOne({ email: email?.toLowerCase() });
    userExist && next(new AppError("user already exist", 409)) 
    // if (userExist) {
    //     return next(new AppError("user already exist", 409));
    // }
    const token = jwt.sign({ email }, process.env.signatureKey, { expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;
    const reToken = jwt.sign({ email }, process.env.signatureKeyRefresh);
    const reLink = `${req.protocol}://${req.headers.host}/users/refreshToken/${reToken}`;
    await sendEmail({
        to: email, subject: 'confirm', html: `
        <a href="${link}" >Confirm your email </a>
        <br/>
        <a href="${reLink}" >Resend</a>
        ` })
    const hash = bcrypt.hashSync(password, parseInt(process.env.saltRound));
    const user = await userModel.create({ name, email, password: hash, age, phone, addresses });
    if (user) {
        res.status(201).json({ message: 'Success', user });
    } else {
        next(new AppError('Fail to create', 500));  
    } 
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.signatureKey);
    if (!decoded) {
        next(new AppError("Invalid token", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true })
    if (user) {
        res.status(200).json({ message: 'Email confirmed' })
    } else {
        next(new AppError('Fail to confirm', 500))
    }
})

export const refreshToken = asyncHandler(async (req, res, next) => {
    const { reToken } = req.params;
    const decoded = jwt.verify(reToken, process.env.signatureKeyRefresh);
    if (!decoded) return next(new AppError("Invalid token", 400))
    const user = await userModel.findOne({ email: decoded.email, confirmed: true })
    if (user) {
        return res.json({message:'User Already confirmed'})
    }
    const token = jwt.sign({ email: decoded?.email }, 'hagar', { expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;
    await sendEmail({ to: decoded?.email, subject: 'confirm', html: `<a href="${link}" >Confirm your email </a>` })
    return res.status(200).json({ message: 'Success' })
})

/***************************************************forgetPassword************************************************************************/
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
      return  next(new AppError("email not found", 409))
    }
    const code = customAlphabet("123456789",5)
    const newCode = code()
    await sendEmail({ to: email, subject: 'code for reset password', html: `<h1> your code is ${newCode} </h1>` })
    await userModel.updateOne({email}, {code: newCode})
    return res.status(200).json({ message: 'Success' })
})


/***************************************************resetPassword************************************************************************/
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
      return  next(new AppError("email not found", 409))
    }
    if(user.code !== code || user.code == ""){
        return  next(new AppError("invalid code", 409))
    }
    const hash = bcrypt.hashSync(password, +process.env.saltRound)
    
    await userModel.updateOne({email}, {password : hash, code :"" , passwordChangeAt: Date.now()})
    return res.status(200).json({ message: 'Success' })
})



/***************************************************signIn************************************************************************/
export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase(), confirmed : true })
    if (!user || ! bcrypt.compareSync(password, user.password )) {
      return  next(new AppError(" wrong email or password ", 409))
    }
    const token = jwt.sign({email,id:user._id, role:user.role}, process.env.signatureKey)

    await userModel.updateOne({email}, {loggedIn : true})
    return res.status(200).json({ message: 'Success', token, user })
})
