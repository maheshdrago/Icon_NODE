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
exports.AdminMiddleware = void 0;
const __1 = require("..");
const auth_1 = require("../schema/auth");
const validations_1 = require("../exceptions/validations");
const root_1 = require("../exceptions/root");
const AdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = auth_1.SignupSchema.parse(req.body);
    const email = body.email;
    const user = yield __1.prismaClient.user.findFirst({ where: { email: email } });
    if ((user === null || user === void 0 ? void 0 : user.role) == "USER") {
        next(new validations_1.AuthorizationError("User not Authorised", root_1.ErrorCode.UNAUTHORIZED_ERROR, null));
    }
    else {
        next();
    }
});
exports.AdminMiddleware = AdminMiddleware;
