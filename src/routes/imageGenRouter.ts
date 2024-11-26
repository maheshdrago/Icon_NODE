import { Router } from "express";
import { generateImageFromURL,generateImage  } from "../controllers/imageGen";
import { accessMiddleware } from "../middleware/accessMiddleware";


const imageRouter = Router()

imageRouter.post("/generate",accessMiddleware, generateImage)
imageRouter.post("/generate_from_url", generateImageFromURL)

export default imageRouter