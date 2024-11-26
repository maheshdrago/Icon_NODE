import puppeteer from "puppeteer";
import {
  BadRequestsException,
  ScraperException,
} from "./exceptions/bad-requests";
import { ErrorCode } from "./exceptions/root";


async function scrapeAboutPage(url: string) {
  let browser = null;
  let httpStatus: number | null = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      new URL(url);
    } catch {
      throw new BadRequestsException(
        `Invalid URL format: ${url}`,
        ErrorCode.INVALID_URL
      );
    }

    page.on("response", (response) => {
      if (response.url() === url) {
        httpStatus = response.status();
      }
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    if (httpStatus && httpStatus >= 400) {
      throw new BadRequestsException(
        `Failed to load the page. HTTP status code: ${httpStatus}`,
        ErrorCode.SITE_UNSCRAPABLE
      );
    }

    const rawContent = await page.evaluate(() => {
      const body = document.querySelector("body");
      return body ? body.innerText.trim() : "Content not found";
    });

    const metaColors = await page.evaluate(() => {
      const metaTags = [
        ...document.querySelectorAll(
          'meta[name="theme-color"], meta[name="color"]'
        ),
      ];
      return metaTags
        .map((tag) => (tag as HTMLMetaElement).content)
        .filter(Boolean);
    });

    const cleanedContent = preprocessContent(rawContent);

    return { aboutContent : cleanedContent, metaColors };
  } catch (error: any) {
    throw new ScraperException(
      `Error scraping the page: ${error.message}`,
      ErrorCode.SITE_UNSCRAPABLE,
      error
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const preprocessContent = (content: string): string => {
    let cleaned = content.replace(/[\n\r\t]+/g, " "); // Replace newlines and tabs with spaces
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s.,]/g, ""); // Remove special characters except for dots, commas, and spaces
    cleaned = cleaned.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
    return cleaned.trim(); // Remove leading and trailing spaces
}

export default scrapeAboutPage;
