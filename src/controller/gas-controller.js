import gasService from "../service/gas-service.js";


const stok = async (req, res, next) => {
    try {
        // const user = req.user;
        // const request = {
        //     inputDate: req.body.
        //     countStok:
        //     information:
        // }
        const result = await gasService.stok();
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await gasService.update(req);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        // const user = req.user;
        // const request = {
        //     inputDate: req.body.
        //     countStok:
        //     information:
        // }
        const result = await gasService.add(req.user, req.body);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        next(error);
    }
}

const deleteStok = async (req, res, next) => {
    try {
        // const user = req.user;
        // const request = {
        //     inputDate: req.body.
        //     countStok:
        //     information:
        // }
        const result = await gasService.deleteStok(req.user, req.params.id);
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
    printSalesHistory,
    stok,
    update,
    deleteStok
}