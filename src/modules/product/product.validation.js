
import joi from 'joi'
import { generalFields } from '../../../utils/generalFields.js'

//       { title, description, category, subCategory, brand, price, discount, stock }
export const createProductValidation = {
    body: joi.object({
        title:joi.string().min(3).max(30).required(),
        description:joi.string().min(3).required(),
        stock: joi.number().min(1),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer().required(),
        category: generalFields.id.required(),
        subCategory: generalFields.id.required(),
        brand: generalFields.id.required(),
    }),
    files: joi.object({
        image : joi.array().items(generalFields.file.required()).required(),
        coverImages: joi.array().items(generalFields.file.required()).required()
    }).required(),
    headers: generalFields.headers.required()
}


export const updateProductValidation = {
    body: joi.object({
        title:joi.string().min(3).max(30),
        description:joi.string().min(3),
        stock: joi.number().min(1),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer(),
        category: generalFields.id.required(),
        subCategory: generalFields.id.required(),
        brand: generalFields.id.required(),
    }),
    params: joi.object({
        id: generalFields.id.required(),
    }),
    files: joi.object({
        image : joi.array().items(generalFields.file),
        coverImages: joi.array().items(generalFields.file)
    }),
    headers: generalFields.headers.required()

}



