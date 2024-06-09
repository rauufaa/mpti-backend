import { databaseQuery } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken"

const refresh_token = async (req) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new ResponseError(400, "Unauthorized")
    }
    let query = "SELECT username, nama, email FROM users WHERE token = ?"
    let params = [refreshToken]
    let [resultUser, field] = await databaseQuery(query, params)
    // console.log(resultUser.at(0).password)
    if(resultUser.length == 0){
        throw new ResponseError(400, "User not found")
    }
    const nama = resultUser.at(0).nama
    const username = resultUser.at(0).username
    const email = resultUser.at(0).email
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
        if(err){
            throw new ResponseError(400, "Unauthorized")
        }
        return jwt.sign({username, nama, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15s"
        })
    })
}

export default {
    refresh_token
}