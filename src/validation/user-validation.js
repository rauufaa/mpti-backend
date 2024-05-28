import Joi from "joi"


const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
})

const emailUserValidation = Joi.object({
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required()
})

const codeOtpUserValidation = Joi.object({
    code: Joi.string().min(6).max(6).required(),
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required()
})

const repassUserValidation = Joi.object({
    code: Joi.string().min(6).max(6).required(),
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required(),
    password: Joi.string().min(6).max(100).required(),
    repassword: Joi.string().min(6).max(100).required(),
})

const logoutUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    token: Joi.string().max(100).required(),
})

export {
    loginUserValidation,
    emailUserValidation,
    codeOtpUserValidation,
    repassUserValidation,
    logoutUserValidation
}