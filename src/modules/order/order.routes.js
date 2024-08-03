import { Router } from "express";
import * as OC from "./order.controller.js";
import * as OV from "./order.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../../utils/systemRoles.js";

const orderRouter = Router({ mergeParams: true })

orderRouter.post(
    "/",
    validation(OV.createOrder),
    auth(),
//    authorization([systemRoles.user]),
    OC.createOrder
)
orderRouter.put(
    "/:id",
    validation(OV.cancelOrder),
    auth(),
 //   authorization([systemRoles.user]),
    OC.cancelOrder
)




export default orderRouter 