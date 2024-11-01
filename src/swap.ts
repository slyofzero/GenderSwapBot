import fs from "fs/promises";
import FormData from "form-data";
import axios from "axios";
import { errorHandler, log } from "./utils/handlers";
import { nanoid } from "nanoid";
import { API_TOKEN } from "./utils/env";
import { GenderSwapInput } from "./vars/state";
import { addWatermarkToImage } from "./utils/bot";
import { watermark } from "./utils/constants";
import { CallbackQueryContext, Context } from "grammy";

export async function genderSwap(
  ctx: CallbackQueryContext<Context>,
  data: GenderSwapInput
) {
  const { file, target } = data;
  // Create a readable stream for the image file
  const imageStream = await fs.readFile(file);

  // Prepare the form data
  const formData = new FormData();
  formData.append("image", imageStream, {
    filename: "image.jpg",
    contentType: "image/jpeg",
  });
  formData.append("action_type", "V2_GENDER");
  formData.append("quality_control", "NORMAL");
  formData.append("target", target);

  // Set headers including form-data headers
  const headers = {
    "ailabapi-api-key": API_TOKEN,
    ...formData.getHeaders(), // Include form-data headers
  };

  try {
    const response = await axios.post(
      "https://www.ailabapi.com/api/portrait/effects/face-attribute-editing",
      formData,
      { headers }
    );

    const base64Image = response.data.result.image;

    // Decode the base64 image to a buffer
    const imageBuffer = Uint8Array.from(atob(base64Image), (char) =>
      char.charCodeAt(0)
    );

    // Write the image to a file
    const newFileName = `./temp/${nanoid(10)}.jpg`;
    await fs.writeFile(newFileName, imageBuffer);
    await addWatermarkToImage(newFileName, watermark);

    log("Stored image");
    return newFileName;
  } catch (error) {
    errorHandler(error);

    const err = error as Error;
    const errMsg = err.message;

    if (errMsg.includes("status code 422")) {
      ctx.reply(
        "This image couldn't be used, please try another one. The image should be larger than 256x256px, smaller than 4096x4096px. The face area must be 64x64px or more."
      );
    } else if (errMsg.includes("status code 413")) {
      ctx.reply(
        "The image you used is too large, maximum image size can be 4mb."
      );
    }
  }
}
