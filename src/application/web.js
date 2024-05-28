import express from "express"
import { publicRouter } from "../routes/public-api.js"
import { errorMiddleware } from "../middleware/error-middleware.js"
import cors from "cors"
import { userRouter } from "../routes/api.js"




export const web = express()
web.use(express.json())
web.use(cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
    origin: "*"
}))

web.use(publicRouter)
web.use(userRouter)
web.use(errorMiddleware)

