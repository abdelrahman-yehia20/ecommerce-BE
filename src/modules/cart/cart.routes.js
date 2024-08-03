import { Router } from "express";
import * as CC from "./cart.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./cart.validation.js";
import { systemRoles } from "../../../utils/systemRoles.js";

const cartRouter = Router()
cartRouter.post("/",
    validation(CV.createCartValidation),
    auth(Object.values(systemRoles)),
     CC.createCart)

cartRouter.put("/",
    validation(CV.removeCartValidation),
    auth(Object.values(systemRoles)),
    CC.removeCart)     

cartRouter.patch("/",
    validation(CV.clearCartValidation),
    auth(Object.values(systemRoles)),
    CC.clearCart)     

    
export default cartRouter 