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
exports.generateImageFromURL = exports.generateImage = void 0;
const auth_1 = require("../schema/auth");
const secrets_1 = require("../secrets");
const utils_1 = __importDefault(require("../utils"));
// Updated generatePrompt function to handle both text and keyword arrays
const generatePrompt = ({ prompt, keywords, num_images, color, iconStyle, customColor, }) => {
    // If keywords are provided, use them; otherwise, use the raw prompt
    // If keywords are provided, use them; otherwise, use the raw prompt
    let finalPrompt = "Generate a single cohesive, icon that is less noisy, ";
    // If keywords are provided, use them; otherwise, use the raw prompt
    if (keywords && keywords.length > 0) {
        finalPrompt += ` representing concepts: ${keywords.join(", ")}`;
    }
    else if (prompt) {
        finalPrompt += ` for: ${prompt}`;
    }
    else if (prompt) {
        finalPrompt += ` for: ${prompt}`;
    }
    // Add optional style, color, and customization
    if (iconStyle) {
        finalPrompt += `, styled as ${iconStyle}`;
    }
    if (color) {
        finalPrompt += `, with color ${color}`;
    }
    if (customColor) {
        finalPrompt += `, using custom color ${customColor}`;
    }
    return finalPrompt;
};
// Prompt-based image generation
const generateImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = auth_1.PromptReqSchema.parse(req.body);
        const { prompt, num_images, color, iconStyle, customColor } = body;
        const finalPrompt = generatePrompt({
            prompt,
            num_images,
            color,
            iconStyle,
            customColor,
        });
        console.log("Generated Prompt:", finalPrompt);
        let numImages = num_images || 1;
        let images = [];
        while (numImages > 0) {
            const response = yield fetch(`https://api.cloudflare.com/client/v4/accounts/${secrets_1.CLF_ACCOUNT_ID}/ai/run/${secrets_1.CLF_MODEL}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${secrets_1.CLF_API_Token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: finalPrompt,
                    guidance: 8,
                }),
            });
            const responseBuffer = yield response.arrayBuffer();
            const bufferString = Buffer.from(responseBuffer).toString("base64");
            images.push(`data:image/png;base64,${bufferString}`);
            numImages -= 1;
        }
        res.status(200).json({ status: "Success", images });
    }
    catch (error) {
        console.error("Error generating image:", error);
        next(error); // Pass the error to the next middleware
    }
});
exports.generateImage = generateImage;
// URL-based image generation
const generateImageFromURL = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, num_images, color, iconStyle, customColor } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        // Scrape the URL
        const scrapedContent = yield (0, utils_1.default)(url);
        const response = yield fetch(`http://localhost:5000/extract_keywords`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: scrapedContent.aboutContent }),
        });
        const { keywords } = yield response.json();
        if (!keywords || keywords.length === 0) {
            return res
                .status(400)
                .json({ error: "No keywords found in the provided URL" });
        }
        console.log("Extracted Keywords:", keywords);
        // Generate the prompt using extracted keywords
        const finalPrompt = generatePrompt({
            keywords,
            num_images,
            color,
            iconStyle,
            customColor,
        });
        console.log("Generated Prompt:", finalPrompt);
        // Call the image generation API
        let numImages = num_images || 1;
        let images = [];
        while (numImages > 0) {
            const response = yield fetch(`https://api.cloudflare.com/client/v4/accounts/${secrets_1.CLF_ACCOUNT_ID}/ai/run/${secrets_1.CLF_MODEL}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${secrets_1.CLF_API_Token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: finalPrompt,
                    negative_prompt: "Dont use keywords individually",
                    guidance: 9
                }),
            });
            const responseBuffer = yield response.arrayBuffer();
            const bufferString = Buffer.from(responseBuffer).toString("base64");
            images.push(`data:image/png;base64,${bufferString}`);
            numImages -= 1;
        }
        res.status(200).json({ status: "Success", images });
    }
    catch (error) {
        next(error);
    }
});
exports.generateImageFromURL = generateImageFromURL;
