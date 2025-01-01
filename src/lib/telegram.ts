import { Telegraf } from "telegraf";
import { config } from "../config";
import { Grant, WebhookData } from "../types/webhook";

export class TelegramNotifier {
  private bot: Telegraf;
  private readonly DESCRIPTION_MAX_LENGTH = 150;
  private readonly MILESTONE_MAX_LENGTH = 150;

  constructor() {
    this.bot = new Telegraf(config.telegram.botToken);
    this.setupBot();
  }

  private setupBot() {
    this.bot.command("start", ctx => {
      const message = `👋 <b>Welcome to ENS PG Bot!</b>
🔔 I notify the community about:
• New grant applications
• New stage submissions
✨ Features:
• Real-time notifications
• Detailed grant information`;
      ctx.reply(message, { parse_mode: "HTML" });
    });
    this.bot.launch().catch(console.error);
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength).trim() + "..." : text;
  }

  private escapeHtml(text: string): string {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  private makeGithubUrl(github: string): string {
    if (!github) return "";

    // Remove any leading @ symbols and trim whitespace
    const cleanHandle = github.replace(/^@+/, "").trim();

    // If it's already a full URL, return it
    if (cleanHandle.startsWith("http")) {
      return cleanHandle;
    }

    // Remove 'github.com/' if it's at the start of the string
    const username = cleanHandle.replace(/^github\.com\//, "");

    return `https://github.com/${username}`;
  }

  private makeTwitterUrl(twitter: string): string {
    if (twitter.startsWith("http")) return twitter;
    const cleanHandle = twitter.replace(/^@+/, "").trim();
    return `https://twitter.com/${cleanHandle}`;
  }

  private makeEtherscanUrl(address: string): string {
    return `https://etherscan.io/address/${address}`;
  }

  private makeGrantUrl(grantId: number): string {
    return `${config.app.baseUrl}/grants/${grantId}`;
  }

  private formatTelegramHandle(handle: string): string {
    return handle.replace(/^@+/, "").trim();
  }

  private formatSocialLinks(grant: Grant | WebhookData["grant"]): string {
    let links = `• <a href="${this.makeGrantUrl(grant.id)}">View Grant</a>`;

    links += `\n• <a href="${this.makeGithubUrl(grant.github)}">GitHub</a>`;

    if (grant.twitter) {
      links += `\n• <a href="${this.makeTwitterUrl(grant.twitter)}">Twitter</a>`;
    }

    if (grant.telegram) {
      links += `\n• Telegram: @${this.formatTelegramHandle(grant.telegram)}`;
    }

    if (grant.showcaseVideoUrl) {
      links += `\n• <a href="${grant.showcaseVideoUrl}">Showcase Video</a>`;
    }

    return links;
  }

  async notifyNewGrant(grant: Grant) {
    const truncatedDescription = this.truncateText(grant.description, this.DESCRIPTION_MAX_LENGTH);
    const message = `🎉 <b>New Grant Application!</b>

<b>Title:</b> ${this.escapeHtml(grant.title)}
<b>Requested:</b> ${grant.requestedFunds} ETH
<b>Builder:</b> <a href="${this.makeEtherscanUrl(grant.builderAddress)}">${grant.builderAddress}</a>

<b>Description:</b>
${this.escapeHtml(truncatedDescription)}

<b>Links:</b>
${this.formatSocialLinks(grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }

  async notifyNewStage(data: WebhookData) {
    const truncatedMilestone = this.truncateText(data.newStage.milestone, this.MILESTONE_MAX_LENGTH);
    const message = `📝 <b>New Stage Submitted!</b>

<b>Grant:</b> ${this.escapeHtml(data.grant.title)}
<b>Stage Number:</b> ${data.grant.stages.length + 1}
<b>Builder:</b> <a href="${this.makeEtherscanUrl(data.grant.builderAddress)}">${data.grant.builderAddress}</a>

<b>Planned milestones:</b>
${this.escapeHtml(truncatedMilestone)}

<b>Links:</b>
${this.formatSocialLinks(data.grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }
}
