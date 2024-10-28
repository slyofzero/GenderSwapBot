import { genderSwap } from "@/swap";
import { downloadImage } from "@/utils/bot";
import { CallbackQueryContext, Context, InputFile } from "grammy";
import fs from "fs/promises";
import { GenderSwapInput, genderSwapInput, userState } from "@/vars/state";

export async function swapQuery(ctx: CallbackQueryContext<Context>) {
  const id = ctx.from.id;
  const photo = ctx.update.message?.photo?.at(2);
  const storedLocation = await downloadImage(photo?.file_id || "");
  genderSwapInput[id] = { ...genderSwapInput[id], file: storedLocation };

  if (storedLocation) {
    ctx.reply("Performing gender swap");
    const newFile = await genderSwap(genderSwapInput[id] as GenderSwapInput);
    if (newFile) {
      const file = new InputFile(newFile);
      await ctx.replyWithPhoto(file);

      fs.unlink(storedLocation);
      fs.unlink(newFile);
      delete userState[id];
    }
  }
}
