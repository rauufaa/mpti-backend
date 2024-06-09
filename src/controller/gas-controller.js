import gasService from "../service/gas-service.js";


const add = async (req, res, next) => {
    try {
        const result = await gasService.add(req);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        next(error);
    }
}

const history = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            page: req.query.page,
            size: req.query.size,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const result = await gasService.history(user, request);
        res.status(200).json({
            ok: true,
            data: result.data,
            paging: result.paging
        });
    } catch (error) {
        next(error);
    }
}

const saleshistory = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            page: req.query.page,
            size: req.query.size,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const result = await gasService.salesHistory(user, request);
        res.status(200).json({
            ok: true,
            data: result.data,
            dataSold: result.dataSold,
            paging: result.paging
        });
    } catch (error) {
        next(error);
    }
}

const printHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const result = await gasService.printHistory(user, request);
        res.status(200).json({
            ok: true,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
}

const printSalesHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const result = await gasService.printSalesHistory(user, request);
        res.status(200).json({
            ok: true,
            data: result.data,
            dataSold: result.dataSold,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    add,
    history,
    saleshistory,
    printHistory,
    printSalesHistory
}