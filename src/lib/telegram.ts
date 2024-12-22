import { Telegraf } from "telegraf";
import { config } from "../config";
import { Grant, Stage, WebhookData } from "../types/webhook";

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
Requested: ${Number(grant.requestedFunds)} ETH
Builder: ${grant.builderAddress}

Description:
${grant.description}

Github: ${grant.github}
${grant.twitter ? `Twitter: ${grant.twitter}` : ""}
${grant.telegram ? `Telegam: @${grant.telegram}` : ""}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      parse_mode: "HTML",
    });
  }

  async notifyNewStage(stage: WebhookData) {
    const message = `📝 New Stage Submitted!
      
Grant: ${stage.grant.title}
Stage Number: ${stage.grant.stages.length}

Milestone:
${stage.newStage.milestone || "No milestone description provided"}

Builder: ${stage.grant.builderAddress}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      parse_mode: "HTML",
    });
  }
}
