import dotenv from "dotenv";
dotenv.config();

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    channelId: process.env.TELEGRAM_CHANNEL_ID || "",
  },
  server: {
    port: process.env.PORT || 8080,
    webhookSecret: process.env.WEBHOOK_SECRET || "",
  },
} as const;
