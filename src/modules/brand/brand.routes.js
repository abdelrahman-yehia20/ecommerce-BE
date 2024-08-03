import { Router } from "express";
import * as BC from "./brand.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as BV from "./brand.validation.js";

const router = Router()
router.post("/",
    multerHost(validExtention.image).single("image"),
    validation(BV.createBrandValidation),
    auth(["admin"]),
     BC.createBrand)

router.put("/:id",
    multerHost(validExtention.image).single("image"),
    validation(BV.updateBrandValidation),
    auth(["admin"]),
    BC.updateBrand)     






export default router 