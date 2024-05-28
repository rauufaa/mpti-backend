import customerService from "../service/customer-service.js";


const cekNik = async (req, res, next) => {
    try {
        const result = await customerService.cekNik(req.body);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
}

export default {
    cekNik
}