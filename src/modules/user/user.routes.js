import { Router } from "express";
import * as UC from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js";

const router = Router()
router.post("/signUp",  validation(UV.signUpValidation), UC.signUp)
router.get("/verifyEmail/:token", UC.verifyEmail)
router.get("/refreshToken/:reToken", UC.refreshToken)
router.patch("/sendCode", UC.forgetPassword)
router.patch("/resetPassword", UC.resetPassword)
router.post("/signIn",  validation(UV.signInValidation), UC.signIn)




//router.post("/signIn", validation(UV.signInValidation), UC.signIn)



export default router 