import { nanoid } from "nanoid";
import { teleBot } from "..";
import axios from "axios";
import fs from "fs";
import { errorHandler, log } from "./handlers";
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", {
  family: "DejaVu Sans",
});

// eslint-disable-next-line
export function cleanUpBotMessage(text: any) {
  text = String(text);
  text = text
    .replace(/\./g, "\\.")
    .replace(/-/g, "\\-")
    .replace(/!/g, "\\!")
    .replace(/#/g, "\\#");

  return text;
}

// eslint-disable-next-line
export function hardCleanUpBotMessage(text: any) {
  text = String(text);
  text = text
    .replace(/\./g, "\\.")
    .replace(/-/g, "\\-")
    .replace(/_/g, "\\_")
    .replace(/\|/g, "\\|")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/`/g, "\\`")
    .replace(/\+/g, "\\+")
    .replace(/!/g, "\\!")
    .replace(/#/g, "\\#")
    .replace(/\*/g, "\\*");

  return text;
}

export async function downloadImage(fileId: string) {
  try {
    // Get file info from Telegram
    const file = await teleBot.api.getFile(fileId);

    // Construct the full URL for the file on Telegram's servers
    const fileUrl = `https://api.telegram.org/file/bot${teleBot.token}/${file.file_path}`;

    // Generate a unique filename using nanoid
    const uniqueFileName = `${nanoid()}.jpg`;

    // Download the file using axios
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    // Save the image to the unique filename
    const filePath = `./temp/${uniqueFileName}`;
    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      response.data.pipe(stream);
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    log(`Image downloaded and saved as ${uniqueFileName}`);
    return filePath;
  } catch (error) {
    errorHandler(error);
  }
}

export async function addWatermarkToImage(
  imagePath: string,
  watermarkText: string
) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // Draw the original image
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Set watermark style
  ctx.font = 'bold 30px "DejaVu Sans"'; // Font size and style
  ctx.fillStyle = "rgba(0, 0, 0)"; // White with transparency
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  // Position the watermark in the bottom-left corner
  const margin = 10;
  ctx.fillText(watermarkText, margin, image.height - margin);

  // Save the image with watermark
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imagePath, buffer);
}
