


export class HttpException extends Error{
    errorCode: ErrorCode
    statusCode: number
    message: string
    errors: any

    constructor(errorCode:ErrorCode, statusCode:number, message:string, errors:any){
        super(message)
        this.errorCode = errorCode
        this.errors = errors
        this.message = message
        this.statusCode = statusCode
    }
    
}

export enum ErrorCode{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_SERVER_ERROR = 3001,
    UNAUTHORIZED_ERROR = 4001,
    INVALID_TOKEN = 4002,
    INVALID_URL = 5001,
    SITE_UNSCRAPABLE = 5002
}