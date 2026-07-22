// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Event_definitionsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Event_definitionsCountOutputTypeSelect, Prisma.Event_definitionsCountOutputTypeSelect> = z.object({
  event_properties: z.boolean().optional()
}).strict();
export const Event_definitionsCountOutputTypeSelectObjectZodSchema = z.object({
  event_properties: z.boolean().optional()
}).strict();
