import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router()



publicRouter.post("/user/login", userController.login)


publicRouter.post("/forget_password/email", userController.send_email)
publicRouter.post("/forget_password/code", userController.send_code)
publicRouter.post("/forget_password/newpass", userController.send_repass)
export {publicRouter}