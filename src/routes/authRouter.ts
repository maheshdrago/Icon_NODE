import { Router, Request, Response, NextFunction } from "express";
import { login, signup, refreshAccessToken } from "../controllers/auth";
import { errorHandler } from "../errorHandler";
import { accessMiddleware } from "../middleware/accessMiddleware";



const authRouter:Router = Router()

authRouter.post("/login" ,errorHandler(login))
authRouter.post("/signup", errorHandler(signup))
authRouter.get("/testAccess",accessMiddleware, (req:Request, res:Response, next:NextFunction) => {
    const user = req.user
    res.json({
        status:"verified",
        username: user?.username
    })
})
authRouter.get("/refreshAccessToken", refreshAccessToken)

export default authRouter;