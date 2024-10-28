import { teleBot } from "@/index";
import { startBot } from "./start";
import { log } from "@/utils/handlers";
import { executeStep } from "../executeStep";
import { CommandContext, Context } from "grammy";
import { swapCommand } from "./swap";

export function initiateBotCommands() {
  teleBot.api
    .setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "swap", description: "Gender swap photos" },
    ])
    .catch(() => null);

  teleBot.command("start", (ctx) => startBot(ctx));
  teleBot.command("swap", (ctx) => swapCommand(ctx));

  teleBot.on(["message"], (ctx) => {
    executeStep(ctx as CommandContext<Context>);
  });

  log("Bot commands up");
}
