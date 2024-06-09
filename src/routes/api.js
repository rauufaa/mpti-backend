import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import customerController from "../controller/customer-controller.js";
import gasController from "../controller/gas-controller.js";


const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.post("/user/logout", userController.logout)

userRouter.post("/customer/nik", customerController.cekNik)

userRouter.post("/gas/add", gasController.add)
userRouter.get("/gas/send", gasController.history)
userRouter.get("/gas/send/download", gasController.printHistory)
userRouter.get("/gas/sales", gasController.saleshistory)
userRouter.get("/gas/sales/download", gasController.printSalesHistory)
export {
    userRouter
}