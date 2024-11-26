import { ErrorCode, HttpException } from "./root";


export class UnProcessableEntity extends HttpException{

    constructor(message:string, errorCode: ErrorCode,errors:any){
        super(errorCode, 422,message, errors)
    }
}


export class InternalServerError extends HttpException{
    constructor(message:string, errorCode: ErrorCode, errors:any){
        super(errorCode, 500, message, errors )
    }
}

export class AuthorizationError extends HttpException{
    constructor(message:string,  errorCode:ErrorCode, errors:any){
        super(errorCode, 401, message, errors)
    }
}
