
import joi from 'joi'
import { generalFields } from '../../../utils/generalFields.js'

export const createBrandValidation = {
    body: joi.object({
        name:joi.string().alphanum().min(3).max(16).required().messages({
            "any.required": "name is required ya m3lm",
            "string.min": "name is too short ya m3lm"
        })
    }),
    file: generalFields.file.required(),
    headers: generalFields.headers.required()

}

export const updateBrandValidation = {
    body: joi.object({
        name:joi.string().alphanum().min(3).max(16)
    }),
    file: generalFields.file,
    headers: generalFields.headers.required()

}


