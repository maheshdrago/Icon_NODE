import { Router, Request, Response } from "express";
import authRouter from "./authRouter";
import imageRouter from "./imageGenRouter";
import scraperRouter from "./scarperRouter";


const rootRouter: Router = Router()

rootRouter.use("/auth", authRouter)
rootRouter.use("/image", imageRouter)
rootRouter.use("/scrape", scraperRouter)

export default rootRouter