import Joi from "joi";


const nikValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]"))
})

const addCustomerValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]")),
    name: Joi.string().max(100).min(1),
    address: Joi.string().max(100).min(1),
    type: Joi.number().positive().default(1).max(2),
})


export {
    nikValidation
}