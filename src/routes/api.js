import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import customerController from "../controller/customer-controller.js";


const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.post("/user/logout", userController.logout)

userRouter.post("/customer/nik", customerController.cekNik)

export {
    userRouter
}