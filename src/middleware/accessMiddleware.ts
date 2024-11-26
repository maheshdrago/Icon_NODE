import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_KEY } from "../secrets";
import { AuthorizationError } from "../exceptions/validations";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";



export const accessMiddleware = async (req:Request, res:Response, next:NextFunction) => {

    let token = req.headers.authorization || ""
    console.log(token)

    if( !token){
        next(new AuthorizationError("Access Denied: Invalid token", ErrorCode.UNAUTHORIZED_ERROR, null))
    }

    try{
        token = token.split(" ")[1]

        const payload = jwt.verify(token, ACCESS_TOKEN_KEY,) as any
        const email = payload.email
        const user = await prismaClient.user.findFirst({where:{email}})

        if(!user){
            next(new AuthorizationError("Unauthorized", ErrorCode.UNAUTHORIZED_ERROR, null))
        }
        else{
            req.user = user
            next()
        }
        
    }
    catch(err){
        next(new AuthorizationError("Access Denied: Invalid token", ErrorCode.INVALID_TOKEN, null))
    }
}