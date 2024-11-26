import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { SignupSchema } from "../schema/auth";
import { AuthorizationError } from "../exceptions/validations";
import { ErrorCode } from "../exceptions/root";


export const AdminMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const body = SignupSchema.parse(req.body)
    const email = body.email
    const user = await prismaClient.user.findFirst({where: {email: email}})
    
    if(user?.role == "USER"){
        next(new AuthorizationError("User not Authorised",ErrorCode.UNAUTHORIZED_ERROR, null ))
    }
    else{
        next()
    }
}

