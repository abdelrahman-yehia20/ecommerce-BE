import { Router } from "express";
import * as CC from "./category.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as CV from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";

const categoryRouter = Router({mergeParams: true})
categoryRouter.use("/:categoryId/subcategories",subCategoryRouter)
categoryRouter.post("/",
    multerHost(validExtention.image).single("image"),
    validation(CV.createCategoryValidation),
    auth(["admin"]),
     CC.createCategory)

categoryRouter.put("/:id",
    multerHost(validExtention.image).single("image"),
    validation(CV.updateCategoryValidation),
    auth(["admin"]),
    CC.updateCategory)     

categoryRouter.delete("/:id",
    multerHost(validExtention.image).single("image"),
    validation(CV.updateCategoryValidation),
    auth(["admin"]),
    CC.updateCategory)     
        


categoryRouter.get("/",
    //auth(Object.values(systemRoles)),
    CC.getCategories)  




export default categoryRouter 