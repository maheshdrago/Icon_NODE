import { Router } from "express";
import scraper from "../controllers/scraper";

const scraperRouter = Router()

scraperRouter.post("/", scraper)


export default scraperRouter