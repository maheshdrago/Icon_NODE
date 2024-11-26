"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const errorHandler_1 = require("../errorHandler");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", (0, errorHandler_1.errorHandler)(auth_1.login));
authRouter.post("/signup", (0, errorHandler_1.errorHandler)(auth_1.signup));
authRouter.get("/testAccess", accessMiddleware_1.accessMiddleware, (req, res, next) => {
    const user = req.user;
    res.json({
        status: "verified",
        username: user === null || user === void 0 ? void 0 : user.username
    });
});
authRouter.get("/refreshAccessToken", auth_1.refreshAccessToken);
exports.default = authRouter;
