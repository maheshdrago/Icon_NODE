"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scraper_1 = __importDefault(require("../controllers/scraper"));
const scraperRouter = (0, express_1.Router)();
scraperRouter.post("/", scraper_1.default);
exports.default = scraperRouter;
