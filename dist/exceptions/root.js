"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(errorCode, statusCode, message, errors) {
        super(message);
        this.errorCode = errorCode;
        this.errors = errors;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.HttpException = HttpException;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 1001] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 1002] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["INCORRECT_PASSWORD"] = 1003] = "INCORRECT_PASSWORD";
    ErrorCode[ErrorCode["UNPROCESSABLE_ENTITY"] = 2001] = "UNPROCESSABLE_ENTITY";
    ErrorCode[ErrorCode["INTERNAL_SERVER_ERROR"] = 3001] = "INTERNAL_SERVER_ERROR";
    ErrorCode[ErrorCode["UNAUTHORIZED_ERROR"] = 4001] = "UNAUTHORIZED_ERROR";
    ErrorCode[ErrorCode["INVALID_TOKEN"] = 4002] = "INVALID_TOKEN";
    ErrorCode[ErrorCode["INVALID_URL"] = 5001] = "INVALID_URL";
    ErrorCode[ErrorCode["SITE_UNSCRAPABLE"] = 5002] = "SITE_UNSCRAPABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
