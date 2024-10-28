import { BOT_USERNAME } from "@/utils/env";
import { CommandContext, Context, InlineKeyboard } from "grammy";
import { cleanUpBotMessage } from "@/utils/bot";

export function startBot(ctx: CommandContext<Context>) {
  const { type } = ctx.chat;

  let text = `*Welcome to ${BOT_USERNAME}!!!*\n\n`;

  if (type === "private") {
    text += `What can this bot do?

@${BOT_USERNAME} is to be added to your project telegram. By adding @${BOT_USERNAME} to your project, you will be able to view  the buys, marketcap and transactions real time. Hype your project with a dedicated buy bot today!

◦ /setup : To setup the bot
◦ /swap : To perfrom genderswap on images`;

    return ctx.reply(cleanUpBotMessage(text), { parse_mode: "MarkdownV2" });
  } else {
    text = "Click below to continue in private chat";
    const keyboard = new InlineKeyboard().url(
      "Continue in private chat",
      `https://t.me/${BOT_USERNAME}?start=true`
    );

    return ctx.reply(text, { reply_markup: keyboard });
  }
}
