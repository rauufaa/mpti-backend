import Joi from 'joi';
import JoiDate from '@joi/date';

const joi_format = Joi.extend(JoiDate)

const addGasValidation = Joi.object({
    inputDate: joi_format.date().format('YYYY-MM-DDTHH:mm').required(),
    countStok: Joi.number().positive().required(),
    information: Joi.string().allow(null, '').max(100).optional(),
})

const updatePriceGasValidation = Joi.object({
    inputDate: joi_format.date().format('YYYY-MM-DDTHH:mm').required(),
    priceBuy: Joi.number().positive().required(),
    priceSell: Joi.number().positive().required(),
})

const searchGasStokHistoryValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    startDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
    endDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
})

const searchGasSalesHistoryValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    startDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
    endDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
})

const downloadGasStokHistoryValidation = Joi.object({
    startDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
    endDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
})

const downloadGasSalesHistoryValidation = Joi.object({
    startDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
    endDate: joi_format.date().format('YYYY-MM-DDTHH:mm').optional(),
})

const deleteGasStokValidation = Joi.number().positive().required()

export {
    addGasValidation,
    searchGasStokHistoryValidation,
    searchGasSalesHistoryValidation,
    downloadGasStokHistoryValidation,
    downloadGasSalesHistoryValidation,
    updatePriceGasValidation,
    deleteGasStokValidation
}
