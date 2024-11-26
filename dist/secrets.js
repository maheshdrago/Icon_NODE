"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLF_MODEL = exports.CLF_API_Token = exports.CLF_ACCOUNT_ID = exports.ACCESS_TOKEN_KEY = exports.REFRESH_TOKEN_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
exports.PORT = process.env.PORT;
exports.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
exports.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
exports.CLF_ACCOUNT_ID = process.env.CLF_ACCOUNT_ID;
exports.CLF_API_Token = process.env.CLF_API_Token;
exports.CLF_MODEL = process.env.CLF_MODEL;
