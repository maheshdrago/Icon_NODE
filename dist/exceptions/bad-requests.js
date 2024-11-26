"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperException = exports.BadRequestsException = void 0;
const root_1 = require("./root");
class BadRequestsException extends root_1.HttpException {
    constructor(message, errorCode) {
        super(errorCode, 400, message, null);
    }
}
exports.BadRequestsException = BadRequestsException;
class ScraperException extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(errorCode, 400, message, errors);
    }
}
exports.ScraperException = ScraperException;
