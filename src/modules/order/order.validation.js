import joi from 'joi'
import { generalFields } from '../../../utils/generalFields.js'


export const createOrder = {
    body: joi.object({
        productId: generalFields.id,
        quantity: joi.number().integer(),
        phone: joi.string().required(),
        address: joi.string().required(),
        couponCode: joi.string().min(3),
        paymentMethod: joi.string().valid("card", "cash").required()
    }),
    headers: generalFields.headers.required(),
}

export const cancelOrder = {
    body: joi.object({
        reason: joi.string().min(3),
    }),
    prams: joi.object({
        productId: generalFields.id.required(),
    }).required(),
    headers: generalFields.headers.required(),
}

