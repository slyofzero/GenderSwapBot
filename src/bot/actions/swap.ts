import { genderSwap } from "@/swap";
import { downloadImage } from "@/utils/bot";
import { CallbackQueryContext, Context, InputFile } from "grammy";
import fs from "fs/promises";
import { GenderSwapInput, genderSwapInput, userState } from "@/vars/state";

const minResolution = 256;
const maxResolution = 4096;
const maxSizeBytes = 4 * 1024 * 1024;

export async function swapQuery(ctx: CallbackQueryContext<Context>) {
  const id = ctx.from.id;
  const photos = ctx.update.message?.photo;
  const photo =
    photos
      ?.reverse()
      .find(
        (photo) =>
          photo.width >= minResolution &&
          photo.height >= minResolution &&
          photo.width <= maxResolution &&
          photo.height <= maxResolution &&
          Number(photo?.file_size) <= maxSizeBytes
      ) || photos?.[0];

  const storedLocation = await downloadImage(photo?.file_id || "");
  genderSwapInput[id] = { ...genderSwapInput[id], file: storedLocation };

  if (storedLocation) {
    ctx.reply("Performing gender swap");
    const newFile = await genderSwap(
      ctx,
      genderSwapInput[id] as GenderSwapInput
    );
    if (newFile) {
      const file = new InputFile(newFile);
      await ctx.replyWithPhoto(file);

      fs.unlink(storedLocation);
      fs.unlink(newFile);
      delete userState[id];
    }
  }
}
