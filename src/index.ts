import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { TelegramNotifier } from "./lib/telegram";
import { validateWebhookSecret } from "./middleware/auth";
import { config } from "./config";
import { grantSchema, webhookSchema } from "./types/webhook";

const app = express();
app.use(express.json());

const telegramNotifier = new TelegramNotifier();

app.post("/webhook/grant", validateWebhookSecret, async (req, res) => {
  try {
    const grantData = grantSchema.parse(req.body);
    await telegramNotifier.notifyNewGrant(grantData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing grant webhook:", error);
    res.status(400).json({ error: "Invalid grant data" });
  }
});

app.post("/webhook/stage", validateWebhookSecret, async (req, res) => {
  try {
    const stageData = webhookSchema.parse(req.body);
    await telegramNotifier.notifyNewStage(stageData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing stage webhook:", error);
    res.status(400).json({ error: "Invalid stage data" });
  }
});

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
