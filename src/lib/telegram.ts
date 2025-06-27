import { Telegraf } from "telegraf";
import { config } from "../config";
import { Grant, WebhookData, LargeGrant, LargeStage, CompleteLargeMilestone } from "../types/webhook";

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
      const message = `👋 <b>Welcome to ENS PG Admin Bot!</b>
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

  private makeLargeGrantUrl(grantId: number): string {
    return `${config.app.baseUrl}/large-grants/${grantId}`;
  }

  private formatTelegramHandle(handle: string): string {
    return handle.replace(/^@+/, "").trim();
  }

  private formatSocialLinks(
    grant:
      | Grant
      | LargeGrant
      | WebhookData["grant"]
      | LargeStage["largeGrant"]
      | CompleteLargeMilestone["largeMilestone"]["stage"]["grant"],
  ): string {
    let links = `\n• <a href="${this.makeGithubUrl(grant.github)}">GitHub</a>`;

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

  private formatGrantSocialLinks(grant: Grant | WebhookData["grant"]): string {
    let links = `• <a href="${this.makeGrantUrl(grant.id)}">View Grant</a>`;
    links += this.formatSocialLinks(grant);

    return links;
  }

  private formatLargeGrantSocialLinks(
    grant: LargeGrant | LargeStage["largeGrant"] | CompleteLargeMilestone["largeMilestone"]["stage"]["grant"],
  ): string {
    let links = `• <a href="${this.makeLargeGrantUrl(grant.id)}">View Grant</a>`;
    links += this.formatSocialLinks(grant);

    return links;
  }

  async notifyNewGrant(grant: Grant) {
    const truncatedDescription = this.truncateText(grant.description, this.DESCRIPTION_MAX_LENGTH);
    const message = `🎉 <b>New ETH Grant Application!</b>

<b>Title:</b> ${this.escapeHtml(grant.title)}
<b>Requested:</b> ${grant.requestedFunds} ETH
<b>Builder:</b> <a href="${this.makeEtherscanUrl(grant.builderAddress)}">${grant.builderAddress}</a>

<b>Description:</b>
${this.escapeHtml(truncatedDescription)}

<b>Links:</b>
${this.formatGrantSocialLinks(grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }

  async notifyNewStage(data: WebhookData) {
    const truncatedMilestone = this.truncateText(data.newStage.milestone, this.MILESTONE_MAX_LENGTH);
    const message = `📝 <b>New ETH Stage Submitted!</b>

<b>Grant:</b> ${this.escapeHtml(data.grant.title)}
<b>Stage Number:</b> ${data.grant.stages.length + 1}
<b>Builder:</b> <a href="${this.makeEtherscanUrl(data.grant.builderAddress)}">${data.grant.builderAddress}</a>

<b>Links:</b>
${this.formatGrantSocialLinks(data.grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }

  async notifyNewLargeGrant(grant: LargeGrant) {
    const truncatedDescription = this.truncateText(grant.description, this.DESCRIPTION_MAX_LENGTH);
    const message = `🎉 <b>New USDC Grant Application!</b>

<b>Title:</b> ${this.escapeHtml(grant.title)}
<b>Requested:</b> ${grant.milestones.reduce((acc, curr) => acc + Number(curr.amount), 0)} USDC
<b>Builder:</b> <a href="${this.makeEtherscanUrl(grant.builderAddress)}">${grant.builderAddress}</a>

<b>Description:</b>
${this.escapeHtml(truncatedDescription)}

<b>Links:</b>
${this.formatLargeGrantSocialLinks(grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }

  async notifyNewLargeStage(data: LargeStage) {
    const message = `📝 <b>New USDC Stage Submitted!</b>

<b>Grant:</b> ${this.escapeHtml(data.largeGrant.title)}
<b>Stage Number:</b> ${data.largeGrant.stages.length + 1}
<b>Requested:</b> ${data.newLargeStage.milestones.reduce((acc, curr) => acc + Number(curr.amount), 0)} USDC
<b>Builder:</b> <a href="${this.makeEtherscanUrl(data.largeGrant.builderAddress)}">${data.largeGrant.builderAddress}</a>

<b>Links:</b>
${this.formatLargeGrantSocialLinks(data.largeGrant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }

  async notifyCompleteLargeMilestone(data: CompleteLargeMilestone) {
    const largeMilestone = data.largeMilestone;
    const message = `📝 <b>New USDC Milestone Completed!</b>

<b>Grant:</b> ${this.escapeHtml(largeMilestone.stage.grant.title)}
<b>Stage Number:</b> ${largeMilestone.stage.stageNumber}
<b>Milestone:</b> ${this.escapeHtml(largeMilestone.description)}
<b>Proposed Deliverables:</b> ${this.escapeHtml(largeMilestone.proposedDeliverables)}
<b>Completion Proof:</b> ${largeMilestone.completionProof}
<b>Amount:</b> ${largeMilestone.amount} USDC
<b>Builder:</b> <a href="${this.makeEtherscanUrl(largeMilestone.stage.grant.builderAddress)}">${largeMilestone.stage.grant.builderAddress}</a>

<b>Links:</b>
${this.formatLargeGrantSocialLinks(largeMilestone.stage.grant)}`;

    await this.bot.telegram.sendMessage(config.telegram.channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }
}
