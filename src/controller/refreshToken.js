import tokenService from "../service/token-service";



const refresh_token = async (req, res, next) => {
    try {
        const result = await tokenService.refresh_token(req)
        res.status(200).json({
            data: result,
            ok: false
        });

    } catch (error) {
        next(error);
    }
}