// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Event_propertiesMinAggregateInputObjectSchema: z.ZodType<Prisma.Event_propertiesMinAggregateInputType, Prisma.Event_propertiesMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  event_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key: z.literal(true).optional(),
  data_type: z.literal(true).optional(),
  required: z.literal(true).optional(),
  example_value: z.literal(true).optional(),
  description: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Event_propertiesMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  event_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key: z.literal(true).optional(),
  data_type: z.literal(true).optional(),
  required: z.literal(true).optional(),
  example_value: z.literal(true).optional(),
  description: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
