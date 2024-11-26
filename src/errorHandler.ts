import { NextFunction, Request, Response } from "express";
import { InternalServerError, UnProcessableEntity } from "./exceptions/validations";
import { ErrorCode, HttpException } from "./exceptions/root";
import { ZodError } from "zod";



export const errorHandler = (callback:Function) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try{
            await callback(req, res, next)
        }
        catch(err:any){
            if(err instanceof HttpException){
                
                next(err)
            }

            else if(err instanceof ZodError){
                next(new UnProcessableEntity("Insufficient Data", ErrorCode.UNPROCESSABLE_ENTITY, err?.issues))
            }

            else{
                next(new InternalServerError("Internal Server Error", ErrorCode.INTERNAL_SERVER_ERROR, null))
            }
        }
    }
    
}

