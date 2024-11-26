import { NextFunction, Request, Response } from "express"
import { promises as fsPromises} from "fs"
import fs from "fs"
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns"
import path from "path"


const logger = async (message:string, filename:string) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime} \t ${uuidv4()} \t ${message}}`

    if(!fs.existsSync(path.join(__dirname, "..", "logs"))){
        await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
    }

    await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), logItem)
}

export const LoggerMiddleware = (req: Request, res:Response, next:NextFunction) => {
    logger(`${req.method}\t ${req.headers.origin} ${req.url}`, "reqLogs.txt")
    next()
}