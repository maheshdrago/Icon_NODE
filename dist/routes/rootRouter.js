"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const imageGenRouter_1 = __importDefault(require("./imageGenRouter"));
const scarperRouter_1 = __importDefault(require("./scarperRouter"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/auth", authRouter_1.default);
rootRouter.use("/image", imageGenRouter_1.default);
rootRouter.use("/scrape", scarperRouter_1.default);
exports.default = rootRouter;
