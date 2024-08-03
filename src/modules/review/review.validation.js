
import joi from 'joi'
import { generalFields } from '../../../utils/generalFields.js'

export const createReviewValidation = {
    body: joi.object({
        comment: joi.string().min(5).required(),
        rate: joi.number().integer().min(1).max(5).required(),
       
    }),
    params: joi.object({
        productId: generalFields.id.required()
    }),
    headers: generalFields.headers.required()

}

export const deleteReviewValidation = {
    params: joi.object({
        id: generalFields.id.required()
    }),
    headers: generalFields.headers.required()

}



