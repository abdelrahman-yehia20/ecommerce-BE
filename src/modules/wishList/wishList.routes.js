import { Router } from "express";
import * as WC from "./wishList.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as WV from "./wishList.validation.js";
import { systemRoles } from "../../../utils/systemRoles.js";

const wishListRouter = Router({mergeParams: true})
wishListRouter.post("/",
    validation(WV.createwishListValidation),
    auth(Object.values(systemRoles)),
     WC.createWishList)

    
export default wishListRouter 