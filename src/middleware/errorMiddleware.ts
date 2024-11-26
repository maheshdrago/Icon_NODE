import { NextFunction, Request, Response, } from "express";
import { HttpException } from "../exceptions/root";


export const ErrorMiddleware = (error: HttpException, req:Request, res:Response,next:NextFunction) => {
    
    res.status(error.statusCode).json({
        errors: error.errors,
        message:error.message,
        errorCode: error.errorCode
    })
}