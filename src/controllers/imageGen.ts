import { NextFunction, Request, Response } from "express";
import { PromptReqSchema } from "../schema/auth";
import { CLF_ACCOUNT_ID, CLF_API_Token, CLF_MODEL } from "../secrets";
import scrapeAboutPage from "../utils";

// Updated generatePrompt function to handle both text and keyword arrays
const generatePrompt = ({
  prompt,
  keywords,
  num_images,
  color,
  iconStyle,
  customColor,
}: {
  prompt?: string;
  keywords?: string[];
  num_images: number;
  color: string;
  iconStyle: string;
  customColor: string;
}) => {

  // If keywords are provided, use them; otherwise, use the raw prompt
  // If keywords are provided, use them; otherwise, use the raw prompt
  let finalPrompt = "Generate a single cohesive, icon that is less noisy, ";

  // If keywords are provided, use them; otherwise, use the raw prompt
  if (keywords && keywords.length > 0) {
    finalPrompt += ` representing concepts: ${keywords.join(", ")}`;
  } else if (prompt) {
    finalPrompt += ` for: ${prompt}`;
  }else if (prompt) {
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
export const generateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = PromptReqSchema.parse(req.body);
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
    let images: string[] = [];

    while (numImages > 0) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLF_ACCOUNT_ID}/ai/run/${CLF_MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CLF_API_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: finalPrompt,
            guidance: 8,
          }),
        }
      );

      const responseBuffer = await response.arrayBuffer();
      const bufferString = Buffer.from(responseBuffer).toString("base64");
      images.push(`data:image/png;base64,${bufferString}`);
      numImages -= 1;
    }

    res.status(200).json({ status: "Success", images });
  } catch (error) {
    console.error("Error generating image:", error);
    next(error); // Pass the error to the next middleware
  }
};

// URL-based image generation
export const generateImageFromURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, num_images, color, iconStyle, customColor } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Scrape the URL
    const scrapedContent = await scrapeAboutPage(url);
    const response = await fetch(`http://localhost:5000/extract_keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: scrapedContent.aboutContent }),
    });

    const { keywords } = await response.json();

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
    let images: string[] = [];

    while (numImages > 0) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLF_ACCOUNT_ID}/ai/run/${CLF_MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CLF_API_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: finalPrompt,
            negative_prompt: "Dont use keywords individually",
            guidance:9
          }),
        }
      );

      const responseBuffer = await response.arrayBuffer();
      const bufferString = Buffer.from(responseBuffer).toString("base64");
      images.push(`data:image/png;base64,${bufferString}`);
      numImages -= 1;
    }

    res.status(200).json({ status: "Success", images });
  } catch (error) {
    next(error);
  }
};
