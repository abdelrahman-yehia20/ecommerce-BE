
import joi from 'joi'
import { generalFields } from '../../../utils/generalFields.js'


export const createSubCategoryValidation = {
    body: joi.object({
        name:joi.string().alphanum().min(3).max(16).required(),
       // category:generalFields.id
    }),
    file: generalFields.file.required(),
    headers: generalFields.headers.required()

}

export const updateSubCategoryValidation = {
    body: joi.object({
        name:joi.string().alphanum().min(3).max(16)
    }),
    file: generalFields.file,
    headers: generalFields.headers.required()

}


