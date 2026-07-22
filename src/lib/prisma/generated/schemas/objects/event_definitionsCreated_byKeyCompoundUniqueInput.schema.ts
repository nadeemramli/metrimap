// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const event_definitionsCreated_byKeyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.event_definitionsCreated_byKeyCompoundUniqueInput, Prisma.event_definitionsCreated_byKeyCompoundUniqueInput> = z.object({
  created_by: z.string(),
  key: z.string()
}).strict();
export const event_definitionsCreated_byKeyCompoundUniqueInputObjectZodSchema = z.object({
  created_by: z.string(),
  key: z.string()
}).strict();
