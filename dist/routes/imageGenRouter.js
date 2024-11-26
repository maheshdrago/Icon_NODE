"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageGen_1 = require("../controllers/imageGen");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const imageRouter = (0, express_1.Router)();
imageRouter.post("/generate", accessMiddleware_1.accessMiddleware, imageGen_1.generateImage);
imageRouter.post("/generate_from_url", imageGen_1.generateImageFromURL);
exports.default = imageRouter;
