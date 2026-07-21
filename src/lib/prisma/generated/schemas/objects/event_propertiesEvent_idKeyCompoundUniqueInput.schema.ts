// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const event_propertiesEvent_idKeyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.event_propertiesEvent_idKeyCompoundUniqueInput, Prisma.event_propertiesEvent_idKeyCompoundUniqueInput> = z.object({
  event_id: z.string(),
  key: z.string()
}).strict();
export const event_propertiesEvent_idKeyCompoundUniqueInputObjectZodSchema = z.object({
  event_id: z.string(),
  key: z.string()
}).strict();
