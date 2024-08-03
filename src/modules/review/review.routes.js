import { Router } from "express";
import * as RC from "./review.controller.js";
import { multerHost, validExtention } from "../../service/multerHost.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import * as RV from "./review.validation.js";

const reviewRouter = Router({mergeParams: true})
reviewRouter.post("/",
    validation(RV.createReviewValidation),
    auth(["admin"]),
     RC.createReview)

reviewRouter.delete("/",
    validation(RV.deleteReviewValidation),
    auth(["admin"]),
    RC.deleteReview)


  






export default reviewRouter 