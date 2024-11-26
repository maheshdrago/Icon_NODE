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
exports.refreshAccessToken = exports.login = exports.signup = void 0;
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secrets_1 = require("../secrets");
const bad_requests_1 = require("../exceptions/bad-requests");
const root_1 = require("../exceptions/root");
const auth_1 = require("../schema/auth");
const validations_1 = require("../exceptions/validations");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = auth_1.SignupSchema.parse(req.body);
    const username = body.username;
    const password = body.password;
    const email = body.email;
    const user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (user) {
        throw new bad_requests_1.BadRequestsException("User Already Exists", root_1.ErrorCode.USER_ALREADY_EXISTS);
    }
    else {
        const password_hash = bcrypt_1.default.hashSync(password, 10);
        yield __1.prismaClient.user.create({
            data: {
                username,
                email,
                password: password_hash
            }
        });
        res.json({
            status: "Success",
            message: "User Created Successfully"
        });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw new bad_requests_1.BadRequestsException("User Does not Exist", root_1.ErrorCode.USER_NOT_FOUND);
    }
    else if (bcrypt_1.default.compareSync(password, user.password)) {
        const access_token = jsonwebtoken_1.default.sign({ email }, secrets_1.ACCESS_TOKEN_KEY, { expiresIn: "10m" });
        const refresh_token = jsonwebtoken_1.default.sign({ email }, secrets_1.REFRESH_TOKEN_KEY, { expiresIn: "1d" });
        res.cookie("REFRESH_TOKEN", refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });
        res.json({
            status: "Success",
            message: "Login Successfull",
            access_token,
        });
    }
    else {
        throw new bad_requests_1.BadRequestsException("Incorrect Password", root_1.ErrorCode.INCORRECT_PASSWORD);
    }
});
exports.login = login;
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.REFRESH_TOKEN)) {
        next(new validations_1.AuthorizationError("User access denied", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
    }
    else {
        try {
            const payload = jsonwebtoken_1.default.verify(cookies.REFRESH_TOKEN, secrets_1.REFRESH_TOKEN_KEY);
            const email = payload.email;
            const user = yield __1.prismaClient.user.findFirst({ where: { email } });
            if (!user) {
                next(new validations_1.AuthorizationError("User unauthorized", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
            }
            else {
                const accessToken = jsonwebtoken_1.default.sign({ email }, secrets_1.ACCESS_TOKEN_KEY, { expiresIn: "10m" });
                res.json({
                    access_token: accessToken
                });
            }
        }
        catch (err) {
            next(new validations_1.AuthorizationError("Invalid token", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
        }
    }
});
exports.refreshAccessToken = refreshAccessToken;
