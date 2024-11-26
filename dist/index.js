"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const rootRouter_1 = __importDefault(require("./routes/rootRouter"));
const client_1 = require("@prisma/client");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const logMiddleware_1 = require("./middleware/logMiddleware");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = 3000;
exports.prismaClient = new client_1.PrismaClient({
    log: ["query"]
});
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(logMiddleware_1.LoggerMiddleware);
app.use((0, cookie_parser_1.default)());
app.use("/api", rootRouter_1.default);
app.use(errorMiddleware_1.ErrorMiddleware);
app.listen(PORT, () => console.log(`Started on port ${PORT}`));
