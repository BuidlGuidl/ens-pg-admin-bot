import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const validateWebhookSecret = (req: Request, res: Response, next: NextFunction): void => {
  const secret = req.headers["x-webhook-secret"];

  if (!secret || secret !== config.server.webhookSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
