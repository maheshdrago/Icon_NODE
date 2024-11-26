"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorMiddleware = (error, req, res, next) => {
    res.status(error.statusCode).json({
        errors: error.errors,
        message: error.message,
        errorCode: error.errorCode
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
