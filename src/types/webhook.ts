import { z } from "zod";

export const grantSchema = z.object({
  id: z.number(),
  grantNumber: z.number(),
  title: z.string(),
  description: z.string(),
  milestones: z.string(),
  showcaseVideoUrl: z.string().optional(),
  requestedFunds: z.string(), // BigInt as string
  github: z.string(),
  email: z.string(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  builderAddress: z.string(),
});

export const stageSchema = z.object({
  id: z.number(),
  stageNumber: z.number(),
  milestone: z.string().optional(),
  grantId: z.number(),
  grantAmount: z.string().optional(), // BigInt as string
  status: z.enum(["proposed", "approved", "completed", "rejected"]),
  statusNote: z.string().optional(),
  grant: grantSchema,
});

export type Grant = z.infer<typeof grantSchema>;
export type Stage = z.infer<typeof stageSchema>;
