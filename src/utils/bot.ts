import { nanoid } from "nanoid";
import { teleBot } from "..";
import axios from "axios";
import fs from "fs";
import { errorHandler, log } from "./handlers";

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
    const filePath = `./${uniqueFileName}`;
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
