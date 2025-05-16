import { z } from "zod";

// AvailableTrigger Schema
export const AvailableTriggerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// AvailableAction Schema
export const AvailableActionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// Trigger Schema
export const TriggerSchema = z.object({
  id: z.string().uuid(),
  zapId: z.string().uuid(),
  triggerId: z.string().uuid(),
  type: AvailableTriggerSchema,
});

// Action Schema
export const ActionSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  sortingOrder: z.number().int().default(0),
  zapId: z.string().uuid(),
  actionId: z.string().uuid(),
  type: AvailableActionSchema,
});

// ZapRunOutbox Schema
export const ZapRunOutboxSchema = z.object({
  id: z.string().uuid(),
  zapRunId: z.string().uuid(),
});

// ZapRun Schema
export const ZapRunSchema = z.object({
  id: z.string().uuid(),
  zapId: z.string().uuid(),
  metadata: z.any().optional(),
  zapRunOutbox: ZapRunOutboxSchema.optional(),
});

// Zap Schema
export const ZapCreateSchema = z.object({
  actions: z.array(
    z.object({
      action: z.string(),
      actionId: z.string().uuid(),
    })
  ),
  availableTriggerId: z.string().uuid(),
});
