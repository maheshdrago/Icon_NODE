"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const validations_1 = require("./exceptions/validations");
const root_1 = require("./exceptions/root");
const zod_1 = require("zod");
const errorHandler = (callback) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield callback(req, res, next);
        }
        catch (err) {
            if (err instanceof root_1.HttpException) {
                next(err);
            }
            else if (err instanceof zod_1.ZodError) {
                next(new validations_1.UnProcessableEntity("Insufficient Data", root_1.ErrorCode.UNPROCESSABLE_ENTITY, err === null || err === void 0 ? void 0 : err.issues));
            }
            else {
                next(new validations_1.InternalServerError("Internal Server Error", root_1.ErrorCode.INTERNAL_SERVER_ERROR, null));
            }
        }
    });
};
exports.errorHandler = errorHandler;
