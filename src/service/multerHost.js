import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../../utils/classError.js";
import path from "path"
import fs from "fs"


export const validExtention = {
    image: ["image/png"],
    pdf: ["application/pdf"],
    video: ["video/mp4", "video/mkv"]

}

export const multerHost = (customValidation = ["image/png"])=>{
 
    const storage = multer.diskStorage({})

      const fileFilter = function(req, file, cb) {
      if(customValidation.includes(file.mimetype)){
        return cb(null, true)
      }
        cb(new AppError('file not support'), false)
      
      }
      
      const upload = multer({ storage: storage, fileFilter: fileFilter })

      return upload

}
