import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { codeOtpUserValidation, emailUserValidation, loginUserValidation, logoutUserValidation, repassUserValidation } from "../validation/user-validation.js"
import { validate_object } from "../validation/validation-util.js"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
import { google } from "googleapis"
// import {  oAuth2Client } from "../application/google-auth.js"
import process from "process";

import fs from "fs/promises"
import path from "path";
import { authorize } from "../application/google-auth.js"
// import { oAuth2Client } from "../application/google-auth.js"

dotenv.config({
    path:'./.env'
})

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');



const register = async (request) => {
    const user = validate_object(loginUserValidation, request)


}  


const login = async (request) => {
    const loginRequest = validate_object(loginUserValidation, request)
    console.log(request)

    let query = "SELECT username, nama, password FROM users WHERE username = ?"
    let params = [loginRequest.username]
    let [resultUser, field] = await databaseQuery(query, params)
    // console.log(resultUser.at(0).password)
    if(resultUser.length == 0){
        throw new ResponseError(400, "User not found")
    }
    const nama = resultUser.at(0).nama
    const username = resultUser.at(0).username
    console.log("belum error")

    const isPasswordValid = await bcrypt.compare(loginRequest.password, resultUser.at(0).password);
    console.log("error")
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString()
    query = "UPDATE users SET token=? WHERE username=?"
    console.log(token)
    params = [token, loginRequest.username]
    resultUser = await databaseQuery(query, params)
    console.log("ini error")
    if (resultUser.affectedRows==0){
        throw new ResponseError(400, "Error")
    }
    console.log("ini error")
    

    return {token, nama, username}
}  

const logout = async (request) => {
    const userRequest = validate_object(logoutUserValidation, request.user);

    let query = "SELECT * FROM users WHERE username=? AND token=?";
    let params = [userRequest.username, userRequest.token];
    let [resultUser, field] = await databaseQuery(query, params);

    if(resultUser.length == 0){
        throw new ResponseError(400, "User not found")
    }

    query = "UPDATE users SET token=NULL WHERE username=?";
    params = [userRequest.username];
    [resultUser, field] = await databaseQuery(query, params);

    if (resultUser.affectedRows==0){
        throw new ResponseError(400, "Error")
    }

    return "Logout Success"
}

const send_email_forgot_pass = async(request) => {
    console.log(request)
    const codeRequest = validate_object(emailUserValidation, request)
    let query = "SELECT email FROM users WHERE email=?";
    let params = [codeRequest.email];
    let [resultUser, field] = await databaseQuery(query, params);

    if(resultUser.length == 0){
        throw new ResponseError(400, "Email tidak ditemukan")
    }


    //for gmail

    const code = generateOTP();

    // const oAuth2Client = new google.auth.OAuth2(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     'https://developers.google.com/oauthplayground'
    // );
    // console.log(process.env.REFRESH_TOKEN, process.env.CLIENT_ID, process.env.CLEINT_SECRET)
    // oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    // console.log(process.env.REFRESH_TOKEN)
    // const tokenAk= await oAuth2Client.getAccessToken()
    // console.log(process.env.REFRESH_TOKEN)
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth:{
    //         type: 'OAuth2',
    //         user: 'rauufanugerahakbar@gmail.com',
    //         clientId: process.env.CLIENT_ID,
    //         clientSecret: process.env.CLIENT_SECRET,
    //         refreshToken: process.env.REFRESH_TOKEN,
    //         accessToken: tokenAk,
    //     }
    // });
      
    // var mailOptions = {
    //     from: process.env.ADMIN_EMAIL,
    //     to: codeRequest.email,
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    // };
    
    // try {
    //     await transporter.sendMail(mailOptions);
    // } catch (error) {
    //     throw new ResponseError(400, error.message)
    // }

    //for hosting
    console.log("mayber disin norma")
    
    // await sendEmailUsingHosting(codeRequest.email, code)
    await sendMailUsingGmail(codeRequest.email, code)
    

    query = "UPDATE users SET token=? WHERE email=?";
    params = [code, codeRequest.email];
    [resultUser, field] = await databaseQuery(query, params);

    if (resultUser.affectedRows==0){
        throw new ResponseError(400, "Error")
    }

    return "Send Email Success"
}

async function sendMailUsingGmail(email, codeOtp){
    // const oAuth2Client = new google.auth.OAuth2(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     'https://www.googleapis.com/auth/gmail.send'
    // );

    // const gmailg = google.gmail({
    //     version:"v1",
    //     auth: "AIzaSyBjOd460TG0y2xwPrpNbpjCOF0XFeQIuRs"
    // })
    console.log("Is this eun")

    const [refresh_token, client_id, client_secret] = await authorize()

    console.log(refresh_token, client_id, client_secret)
    
    // console.log(process.env.REFRESH_TOKEN, process.env.CLIENT_ID, process.env.CLIENT_SECRET)
    // oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    // console.log(process.env.REFRESH_TOKEN, await oAuth2Client.getAccessToken())
    // const tokenAk= await oAuth2Client.getAccessToken()
    // console.log(process.env.REFRESH_TOKEN)
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            type: 'OAuth2',
            user: 'rauufanugerahakbar@gmail.com',
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token,
        }
    });
      
    var mailOptions = {
        from: process.env.MAIL_ADMIN,
        to: email,
        subject: 'Kode Verifikasi Ubah Password',
        text: codeOtp
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log("Error disnisf")
    } catch (error) {
        throw new ResponseError(400, error.message)
    }

}



const send_code_forgot_pass = async(request) => {
    const codeRequest = validate_object(codeOtpUserValidation, request)
    const query = "SELECT * FROM users WHERE token=? and email=?";
    const params = [codeRequest.code, codeRequest.email];
    const [resultUser, field] = await databaseQuery(query, params);

    if(resultUser.length == 0){
        throw new ResponseError(400, "Kode Salah")
    }

    // await sendEmailUsingHosting(codeRequest.email)
    
    return "Authorized"
}

async function sendEmailUsingHosting(email, codeOtp){
    // const code = generateOTP();
    
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_ADMIN,
          pass: process.env.MAIL_PASS
        }
    });
      
    var mailOptions = {
        from: process.env.MAIL_ADMIN,
        to: email,
        subject: 'Kode Verifikasi Ubah Password',
        text: `Jangan bagikan kode ini kepada siapapun tanpa sepengetahuan anda ${codeOtp}`
    };
      
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ResponseError(400, error.message)
    }
    

    // return "Send Email Success"
}

const send_repass_forgot_pass = async (request) => {
    const repassRequest = validate_object(repassUserValidation, request);
    console.log("error repad")
    if(repassRequest.password!==repassRequest.repassword){
        throw new ResponseError(400, "Request error");
    }
    console.log(repassRequest)
    let query = "SELECT * FROM users WHERE email=? and token=?";
    let params = [repassRequest.email, repassRequest.code];
    let [resultUser, field] = await databaseQuery(query, params);

    if(resultUser.length == 0){
        throw new ResponseError(400, "Unauthorized")
    }

    const password = await bcrypt.hash(repassRequest.password, 10)
    console.log(password)
    query = "UPDATE users SET password=?, token=NULL WHERE email=? AND token=?";
    params = [password, repassRequest.email, repassRequest.code];
    [resultUser, field] = await databaseQuery(query, params);

    if (resultUser.affectedRows==0){
        throw new ResponseError(400, "Error")
    }

    return "Success"
}

function generateOTP() { 
  
    // Declare a digits variable 
    // which stores all digits  
    let digits = '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
     
    return OTP; 
} 

export default {
    login,
    logout,
    send_email_forgot_pass,
    send_code_forgot_pass,
    send_repass_forgot_pass
}