// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreated_byKeyCompoundUniqueInputObjectSchema } from './event_definitionsCreated_byKeyCompoundUniqueInput.schema'

export const event_definitionsWhereUniqueInputObjectSchema: z.ZodType<Prisma.event_definitionsWhereUniqueInput, Prisma.event_definitionsWhereUniqueInput> = z.object({
  id: z.string(),
  created_by_key: z.lazy(() => event_definitionsCreated_byKeyCompoundUniqueInputObjectSchema)
}).strict();
export const event_definitionsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  created_by_key: z.lazy(() => event_definitionsCreated_byKeyCompoundUniqueInputObjectSchema)
}).strict();
