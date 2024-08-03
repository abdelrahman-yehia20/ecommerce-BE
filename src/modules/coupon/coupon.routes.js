import { Router } from "express";
import * as CC from "./coupon.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./coupon.validation.js";

const couponRouter = Router()
couponRouter.post("/",
    validation(CV.createCouponValidation),
    auth(["admin"]),
     CC.createCoupon)

couponRouter.put("/:id",
    validation(CV.updateCouponValidation),
    auth(["admin"]),
    CC.updateCoupon)     

  






export default couponRouter 