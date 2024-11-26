"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptReqSchema = exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    username: zod_1.z.string(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.PromptReqSchema = zod_1.z.object({
    prompt: zod_1.z.string(),
    num_images: zod_1.z.number(),
    color: zod_1.z.string(),
    customColor: zod_1.z.string(),
    iconStyle: zod_1.z.string()
});
