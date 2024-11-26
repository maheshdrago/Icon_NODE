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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const validations_1 = require("../exceptions/validations");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const accessMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization || "";
    console.log(token);
    if (!token) {
        next(new validations_1.AuthorizationError("Access Denied: Invalid token", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
    }
    try {
        token = token.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, secrets_1.ACCESS_TOKEN_KEY);
        const email = payload.email;
        const user = yield __1.prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            next(new validations_1.AuthorizationError("Unauthorized", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
        }
        else {
            req.user = user;
            next();
        }
    }
    catch (err) {
        next(new validations_1.AuthorizationError("Access Denied: Invalid token", root_1.ErrorCode.INVALID_TOKEN, null));
    }
});
exports.accessMiddleware = accessMiddleware;
