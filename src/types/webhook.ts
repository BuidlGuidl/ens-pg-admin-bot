import { z } from "zod";

export const grantSchema = z.object({
  id: z.number(),
  title: z.string().trim(),
  description: z.string().trim(),
  milestones: z.string().trim(),
  showcaseVideoUrl: z.string(),
  requestedFunds: z.string(),
  github: z.string(),
  email: z.string().email(),
  twitter: z.string(),
  telegram: z.string(),
  builderAddress: z.string(),
});

const stageSchema = z.object({
  id: z.number(),
  stageNumber: z.number(),
  milestone: z.string().nullable(),
  submitedAt: z.string(),
  grantId: z.number(),
  grantAmount: z.string().optional(),
  status: z.enum(["proposed", "approved", "completed", "rejected"]),
  statusNote: z.string().optional(),
  approvedTx: z.string().optional(),
  approvedAt: z.string().optional(),
});

export const webhookSchema = z.object({
  newStage: z.object({
    milestone: z.string(),
    signature: z.string(),
    grantId: z.number(),
  }),
  grant: z.object({
    id: z.number(),
    grantNumber: z.number(),
    title: z.string(),
    description: z.string(),
    milestones: z.string(),
    showcaseVideoUrl: z.string().optional(),
    requestedFunds: z.string(),
    github: z.string(),
    email: z.string(),
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    submitedAt: z.string(),
    builderAddress: z.string(),
    stages: z.array(stageSchema),
  }),
});

export type Grant = z.infer<typeof grantSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type WebhookData = z.infer<typeof webhookSchema>;
