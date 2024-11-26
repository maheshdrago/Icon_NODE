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
const puppeteer_1 = __importDefault(require("puppeteer"));
const bad_requests_1 = require("./exceptions/bad-requests");
const root_1 = require("./exceptions/root");
function scrapeAboutPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = null;
        let httpStatus = null;
        try {
            browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            try {
                new URL(url);
            }
            catch (_a) {
                throw new bad_requests_1.BadRequestsException(`Invalid URL format: ${url}`, root_1.ErrorCode.INVALID_URL);
            }
            page.on("response", (response) => {
                if (response.url() === url) {
                    httpStatus = response.status();
                }
            });
            yield page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
            if (httpStatus && httpStatus >= 400) {
                throw new bad_requests_1.BadRequestsException(`Failed to load the page. HTTP status code: ${httpStatus}`, root_1.ErrorCode.SITE_UNSCRAPABLE);
            }
            const rawContent = yield page.evaluate(() => {
                const body = document.querySelector("body");
                return body ? body.innerText.trim() : "Content not found";
            });
            const metaColors = yield page.evaluate(() => {
                const metaTags = [
                    ...document.querySelectorAll('meta[name="theme-color"], meta[name="color"]'),
                ];
                return metaTags
                    .map((tag) => tag.content)
                    .filter(Boolean);
            });
            const cleanedContent = preprocessContent(rawContent);
            return { aboutContent: cleanedContent, metaColors };
        }
        catch (error) {
            throw new bad_requests_1.ScraperException(`Error scraping the page: ${error.message}`, root_1.ErrorCode.SITE_UNSCRAPABLE, error);
        }
        finally {
            if (browser) {
                yield browser.close();
            }
        }
    });
}
const preprocessContent = (content) => {
    let cleaned = content.replace(/[\n\r\t]+/g, " "); // Replace newlines and tabs with spaces
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s.,]/g, ""); // Remove special characters except for dots, commas, and spaces
    cleaned = cleaned.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
    return cleaned.trim(); // Remove leading and trailing spaces
};
exports.default = scrapeAboutPage;
