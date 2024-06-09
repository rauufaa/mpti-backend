import Joi from "joi";


const nikValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]"))
})

const addCustomerValidation = Joi.object({
    nik:
    name:
    address:
    type:
    
})


export {
    nikValidation
}