"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.InternalServerError = exports.UnProcessableEntity = void 0;
const root_1 = require("./root");
class UnProcessableEntity extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(errorCode, 422, message, errors);
    }
}
exports.UnProcessableEntity = UnProcessableEntity;
class InternalServerError extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(errorCode, 500, message, errors);
    }
}
exports.InternalServerError = InternalServerError;
class AuthorizationError extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(errorCode, 401, message, errors);
    }
}
exports.AuthorizationError = AuthorizationError;
