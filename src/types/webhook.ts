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

const milestoneSchema = z.object({
  description: z.string(),
  proposedDeliverables: z.string(),
  amount: z.number(),
  proposedCompletionDate: z.string(),
});

export const largeGrantSchema = z.object({
  id: z.number(),
  title: z.string().trim(),
  description: z.string().trim(),
  showcaseVideoUrl: z.string(),
  github: z.string(),
  email: z.string().email(),
  twitter: z.string(),
  telegram: z.string(),
  builderAddress: z.string(),
  milestones: z.array(milestoneSchema),
});

const largeStageDataSchema = z.object({
  id: z.number(),
  stageNumber: z.number(),
});

export const largeStageSchema = z.object({
  newLargeStage: z.object({
    milestones: z.array(milestoneSchema),
    signature: z.string(),
    grantId: z.number(),
  }),
  largeGrant: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    showcaseVideoUrl: z.string().optional(),
    github: z.string(),
    email: z.string(),
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    submitedAt: z.string(),
    builderAddress: z.string(),
    stages: z.array(largeStageDataSchema),
  }),
});

export const completeLargeMilestoneSchema = z.object({
  largeMilestone: z.object({
    description: z.string(),
    proposedDeliverables: z.string(),
    amount: z.number(),
    proposedCompletionDate: z.string(),
    completionProof: z.string(),
    stage: z.object({
      stageNumber: z.number(),
      grant: z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        showcaseVideoUrl: z.string().optional(),
        github: z.string(),
        email: z.string(),
        twitter: z.string().optional(),
        telegram: z.string().optional(),
        submitedAt: z.string(),
        builderAddress: z.string(),
      }),
    }),
  }),
});

export type Grant = z.infer<typeof grantSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type WebhookData = z.infer<typeof webhookSchema>;
export type LargeGrant = z.infer<typeof largeGrantSchema>;
export type LargeStage = z.infer<typeof largeStageSchema>;
export type CompleteLargeMilestone = z.infer<typeof completeLargeMilestoneSchema>;
