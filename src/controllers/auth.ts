import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignupSchema, LoginSchema } from "../schema/auth";
import { AuthorizationError } from "../exceptions/validations";




export const signup = async (req:Request, res:Response, next: NextFunction) => {
        const body = SignupSchema.parse(req.body)
        
        const username = body.username
        const password = body.password
        const email = body.email

        const user = await prismaClient.user.findFirst({where:{email}})

        if(user){
            throw new BadRequestsException("User Already Exists", ErrorCode.USER_ALREADY_EXISTS)
        }

        else{
            const password_hash = bcrypt.hashSync(password, 10)
            await prismaClient.user.create({
                data:{
                    username,
                    email,
                    password: password_hash
                }
            })

            res.json({
                status:"Success",
                message:"User Created Successfully"
            })
        }
    

}

export const login = async (req:Request, res:Response, next:NextFunction) => {

        const email = req.body.email;
        const password = req.body.password;

        let user = await prismaClient.user.findFirst({where:{email}})

        if(!user){
            throw new BadRequestsException("User Does not Exist", ErrorCode.USER_NOT_FOUND)
        }

        else if(bcrypt.compareSync(password, user.password)){
            const access_token = jwt.sign({email}, ACCESS_TOKEN_KEY, {expiresIn: "10m"}, )
            const refresh_token = jwt.sign({email}, REFRESH_TOKEN_KEY, {expiresIn:"1d"})

            res.cookie("REFRESH_TOKEN", refresh_token, {
                httpOnly: true,
                maxAge: 24*60*60*1000,
                sameSite:"none",
                secure: true,
            })

            res.json({
                status:"Success",
                message:"Login Successfull",
                access_token,
            })

        }
        else{
            throw new BadRequestsException("Incorrect Password", ErrorCode.INCORRECT_PASSWORD)
        }
}


export const refreshAccessToken = async (req:Request, res:Response, next:NextFunction) => {

    const cookies = req.cookies
    
    if(!cookies?.REFRESH_TOKEN){
         next(new AuthorizationError("User access denied", ErrorCode.UNAUTHORIZED_ERROR, null))
    }
    else{
        try{
            const payload = jwt.verify(cookies.REFRESH_TOKEN, REFRESH_TOKEN_KEY) as any
            const email = payload.email

            const user = await prismaClient.user.findFirst({where:{email}})
            if(!user){
                next(new AuthorizationError("User unauthorized", ErrorCode.UNAUTHORIZED_ERROR, null))
            }
            else{
                const accessToken = jwt.sign({email}, ACCESS_TOKEN_KEY, {expiresIn:"10m"})
                res.json({
                    access_token: accessToken
                })
            }
        }
        catch(err){
            next(new AuthorizationError("Invalid token", ErrorCode.UNAUTHORIZED_ERROR, null))
        }
        
    }
}

