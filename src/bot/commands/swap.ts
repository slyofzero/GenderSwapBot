import { genderSwapInput, userState } from "@/vars/state";
import {
  CallbackQueryContext,
  InlineKeyboard,
  type CommandContext,
  type Context,
} from "grammy";

export function swapCommand(ctx: CommandContext<Context>) {
  const chatId = ctx.chat.id;
  delete userState[chatId];
  const text = "What do you want to swap to?";
  const keyboard = new InlineKeyboard()
    .text("To Male", "askImage-0")
    .text("To Female", "askImage-1");

  ctx.reply(text, { reply_markup: keyboard });
}

export function askImage(ctx: CallbackQueryContext<Context>) {
  const id = ctx.from.id;
  ctx.deleteMessage();
  const text = "Please send the image to swap on.";
  const target = Number(ctx.callbackQuery.data.at(-1) || 0);
  genderSwapInput[id] = { target };

  userState[id] = "swapImage";
  ctx.reply(text);
}
