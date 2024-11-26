import express, {Express} from "express";
import rootRouter from "./routes/rootRouter";
import { PrismaClient } from "@prisma/client";
import { ErrorMiddleware } from "./middleware/errorMiddleware";
import { LoggerMiddleware } from "./middleware/logMiddleware";
import cors from "cors"
import cookieParser from 'cookie-parser';

const app:Express = express()
const PORT: number = 3000
export const prismaClient = new PrismaClient({
    log:["query"]
})

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
  };

app.use(express.json())
app.use(cors(corsOptions))
app.use(LoggerMiddleware)
app.use(cookieParser())
app.use("/api", rootRouter)

app.use(ErrorMiddleware)

app.listen(PORT, ()=>console.log(`Started on port ${PORT}`))