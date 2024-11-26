import { ErrorCode, HttpException } from "./root";


export class BadRequestsException extends HttpException{

    constructor(message:string, errorCode: ErrorCode){
        super(errorCode, 400, message, null)
    }
}


export class ScraperException extends HttpException{

    constructor(message:string, errorCode: ErrorCode, errors: any ){
        super(errorCode, 400,message , errors)
    }
}