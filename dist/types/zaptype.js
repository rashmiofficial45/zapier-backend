"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapCreateSchema = exports.ZapRunSchema = exports.ZapRunOutboxSchema = exports.ActionSchema = exports.TriggerSchema = exports.AvailableActionSchema = exports.AvailableTriggerSchema = void 0;
const zod_1 = require("zod");
// AvailableTrigger Schema
exports.AvailableTriggerSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
});
// AvailableAction Schema
exports.AvailableActionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
});
// Trigger Schema
exports.TriggerSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    zapId: zod_1.z.string().uuid(),
    triggerId: zod_1.z.string().uuid(),
    type: exports.AvailableTriggerSchema,
});
// Action Schema
exports.ActionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    action: zod_1.z.string(),
    sortingOrder: zod_1.z.number().int().default(0),
    zapId: zod_1.z.string().uuid(),
    actionId: zod_1.z.string().uuid(),
    type: exports.AvailableActionSchema,
});
// ZapRunOutbox Schema
exports.ZapRunOutboxSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    zapRunId: zod_1.z.string().uuid(),
});
// ZapRun Schema
exports.ZapRunSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    zapId: zod_1.z.string().uuid(),
    metadata: zod_1.z.any().optional(),
    zapRunOutbox: exports.ZapRunOutboxSchema.optional(),
});
// Zap Schema
exports.ZapCreateSchema = zod_1.z.object({
    actions: zod_1.z.array(zod_1.z.object({
        action: zod_1.z.string(),
        actionId: zod_1.z.string().uuid(),
    })),
    availableTriggerId: zod_1.z.string().uuid(),
});
