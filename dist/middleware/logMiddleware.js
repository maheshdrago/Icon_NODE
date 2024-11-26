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
exports.LoggerMiddleware = void 0;
const fs_1 = require("fs");
const fs_2 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const path_1 = __importDefault(require("path"));
const logger = (message, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime} \t ${(0, uuid_1.v4)()} \t ${message}}`;
    if (!fs_2.default.existsSync(path_1.default.join(__dirname, "..", "logs"))) {
        yield fs_1.promises.mkdir(path_1.default.join(__dirname, "..", "logs"));
    }
    yield fs_1.promises.appendFile(path_1.default.join(__dirname, "..", "logs", filename), logItem);
});
const LoggerMiddleware = (req, res, next) => {
    logger(`${req.method}\t ${req.headers.origin} ${req.url}`, "reqLogs.txt");
    next();
};
exports.LoggerMiddleware = LoggerMiddleware;
