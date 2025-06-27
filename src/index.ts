import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { TelegramNotifier } from "./lib/telegram";
import { validateWebhookSecret } from "./middleware/auth";
import { config } from "./config";
import {
  grantSchema,
  webhookSchema,
  largeGrantSchema,
  largeStageSchema,
  completeLargeMilestoneSchema,
  completeMilestoneSchema,
} from "./types/webhook";

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

app.post("/webhook/milestone", validateWebhookSecret, async (req, res) => {
  try {
    const milestoneData = completeMilestoneSchema.parse(req.body);
    await telegramNotifier.notifyCompleteMilestone(milestoneData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing milestone webhook:", error);
    res.status(400).json({ error: "Invalid milestone data" });
  }
});

app.post("/webhook/largeGrant", validateWebhookSecret, async (req, res) => {
  try {
    const largeGrantData = largeGrantSchema.parse(req.body);
    await telegramNotifier.notifyNewLargeGrant(largeGrantData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing grant webhook:", error);
    res.status(400).json({ error: "Invalid grant data" });
  }
});

app.post("/webhook/largeStage", validateWebhookSecret, async (req, res) => {
  try {
    const stageData = largeStageSchema.parse(req.body);
    await telegramNotifier.notifyNewLargeStage(stageData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing stage webhook:", error);
    res.status(400).json({ error: "Invalid stage data" });
  }
});

app.post("/webhook/largeMilestone", validateWebhookSecret, async (req, res) => {
  try {
    const milestoneData = completeLargeMilestoneSchema.parse(req.body);
    await telegramNotifier.notifyCompleteLargeMilestone(milestoneData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing milestone webhook:", error);
    res.status(400).json({ error: "Invalid milestone data" });
  }
});

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
