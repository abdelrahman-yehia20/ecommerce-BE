import { Router } from "express";
import * as PC from "./product.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as PV from "./product.validation.js";
import { systemRoles } from "../../../utils/systemRoles.js";
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";

const productRouter = Router({mergeParams: true})
productRouter.use("/:productId/reviews",reviewRouter)
productRouter.use("/:productId/wishList",wishListRouter)
productRouter.post("/",
    multerHost(validExtention.image).fields([
        { name : "image", maxCount: 1}, //[{}]
        {name: "coverImages", maxCount: 3}  //[{},{},{}]
    ]),
    validation(PV.createProductValidation),
    auth(["admin"]),
    PC.createProduct)

productRouter.post("/:id",
    multerHost(validExtention.image).fields([
        { name : "image", maxCount: 1}, //[{}]
        {name: "coverImages", maxCount: 3}  //[{},{},{}]
    ]),
    validation(PV.updateProductValidation),
    auth(["admin"]),
    PC.updateProduct)    


productRouter.get("/",PC.getProducts)    


export default productRouter 