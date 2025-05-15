import { z } from "zod";

// AvailableTrigger Schema
const AvailableTriggerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// AvailableAction Schema
const AvailableActionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// Trigger Schema
const TriggerSchema = z.object({
  id: z.string().uuid(),
  zapId: z.string().uuid(),
  triggerId: z.string().uuid(),
  type: AvailableTriggerSchema,
});

// Action Schema
const ActionSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  sortingOrder: z.number().int().default(0),
  zapId: z.string().uuid(),
  actionId: z.string().uuid(),
  type: AvailableActionSchema,
});

// ZapRunOutbox Schema
const ZapRunOutboxSchema = z.object({
  id: z.string().uuid(),
  zapRunId: z.string().uuid(),
});

// ZapRun Schema
const ZapRunSchema = z.object({
  id: z.string().uuid(),
  zapId: z.string().uuid(),
  metadata: z.any().optional(),
  zapRunOutbox: ZapRunOutboxSchema.optional(),
});

// Zap Schema
const ZapCreateSchema = z.object({
  id: z.string().uuid(),
  trigger: TriggerSchema.optional(),
  actions: z.array(ActionSchema),
  zapRun: z.array(ZapRunSchema),
});
