import Joi from 'joi'
import joi from 'joi'

export const signUpValidation = {
    body: joi.object({
        name:joi.string().alphanum().min(3).max(16).required().messages({
            "any.required": "name is required ya m3lm",
            "string.min": "name is too short ya m3lm"
        }),
        email: joi.string().email({tlds: { allow: ['com', 'net'] }}).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)).required(),
        otp: Joi.string()
    
    })

}


export const signInValidation = joi.object({
    email: joi.string(),
    password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)),
}).options({presence : "required"})