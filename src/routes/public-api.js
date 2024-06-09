import express from "express";
import userController from "../controller/user-controller.js";
import gasController from "../controller/gas-controller.js";

const publicRouter = new express.Router()



publicRouter.post("/user/login", userController.login)


publicRouter.post("/forget-password/email", userController.send_email)
publicRouter.post("/forget-password/code", userController.send_code)
publicRouter.post("/forget-password/new-pass", userController.send_repass)



export {publicRouter}