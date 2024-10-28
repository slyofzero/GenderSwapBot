import { CallbackQueryContext, CommandContext, Context } from "grammy";
import { errorHandler, log } from "@/utils/handlers";
import { userState } from "@/vars/state";
import { swapQuery } from "./actions/swap";
import { askImage } from "./commands/swap";

const steps: { [key: string]: any } = {
  swapImage: swapQuery,
  askImage,
};

const requestIds: { [key: number]: any } = {
  0: () => null,
};

export async function executeStep(
  ctx: CommandContext<Context> | CallbackQueryContext<Context>
) {
  try {
    const request_id = ctx.update.message?.chat_shared?.request_id || 0;
    requestIds[request_id](ctx);

    const chatId = ctx.chat?.id;
    if (!chatId) return ctx.reply("Please redo your action");

    const queryCategory = ctx.callbackQuery?.data?.split("-").at(0);
    const step = userState[chatId] || queryCategory || "";
    const stepFunction = steps[step];

    if (stepFunction) {
      stepFunction(ctx);
    } else {
      log(`No step function for ${queryCategory} ${userState[chatId]}`);
    }
  } catch (error) {
    errorHandler(error);
    const err = error as Error;
    if (err.message.includes("status code 422")) {
      ctx.reply("This image couldn't be used, please try another one.");
    }
  }
}
