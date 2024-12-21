import { Telegraf } from "telegraf";
import { config } from "../config";
import { Grant, Stage } from "../types/webhook";

export class TelegramNotifier {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(config.telegram.botToken);

    this.bot.command("start", ctx => {
      const message = `👋 Welcome to ENS PG Bot!

🔔 I notify the community about:
• New grant applications

✨ Features:
• Real-time notifications
• Detailed grant information`;

      ctx.reply(message);
    });

    this.bot.launch().catch(console.error);
  }

  async notifyNewGrant(grant: Grant) {
    const message = `🎉 New Grant Application!
      
Title: ${grant.title}
Requested: ${Number(grant.requestedFunds) / 1e18} ETH
Builder: ${grant.builderAddress}

Description:
${grant.description}

Github: ${grant.github}
${grant.twitter ? `Twitter: ${grant.twitter}` : ""}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      parse_mode: "HTML",
    });
  }

  async notifyNewStage(stage: Stage) {
    const message = `📝 New Stage Submitted!
      
Grant: ${stage.grant.title}
Stage Number: ${stage.stageNumber}
Status: ${stage.status}

Milestone:
${stage.milestone || "No milestone description provided"}

Builder: ${stage.grant.builderAddress}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      parse_mode: "HTML",
    });
  }
}
