import { databaseQuery } from "../application/database.js"
import jwt from "jsonwebtoken"
export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    console.log(req.body, token)
    // const username = req.body.username;
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        let query = "SELECT username, token FROM users WHERE token=?"
        let params = [token]
        let [user, fields] = await databaseQuery(query, params)

        if (user.length === 0) {
            // throw new ResponseError(400, "User not found")
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user.at(0);
            next();
        }
    }
}

const verifyToken = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1]
    if (!token){
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        jwt.verify(token. process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
            if(err){res.status(401).json({
                errors: "Unauthorized"
            }).end()}else{
                req.email = decoded.email;
            }
        })
    }


}