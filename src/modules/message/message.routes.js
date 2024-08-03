
import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as MC from "./message.controller.js";

const router = Router()

router.post("/",auth(),MC.addMessage)
router.patch("/:id",auth(),MC.updateMessage)
router.delete("/:id",auth(),MC.deleteMessage)

export default router