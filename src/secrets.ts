import dotenv from "dotenv"


dotenv.config({path:".env"})

export const PORT = process.env.PORT
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string
export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string
export const CLF_ACCOUNT_ID = process.env.CLF_ACCOUNT_ID as string
export const CLF_API_Token = process.env.CLF_API_Token as string
export const CLF_MODEL = process.env.CLF_MODEL as string
export const FLASK_URL = process.env.FLASK_URL as string