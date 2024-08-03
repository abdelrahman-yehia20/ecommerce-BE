import { Router } from "express";
import * as SCC from "./subCategory.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as SCV from "./subCategory.validation.js";
import { systemRoles } from "../../../utils/systemRoles.js";

const subcategoryRouter = Router({mergeParams: true})
subcategoryRouter.post("/",
    multerHost(validExtention.image).single("image"),
    validation(SCV.createSubCategoryValidation),
    auth(["admin"]),
    SCC.createSubCategory)

subcategoryRouter.put("/:id",
    multerHost(validExtention.image).single("image"),
    validation(SCV.updateSubCategoryValidation),
    auth(["admin"]),
    SCC.updateSubCategory)  
    
subcategoryRouter.get("/",
    //auth(Object.values(systemRoles)),
    SCC.getSubCategories)    



export default subcategoryRouter 