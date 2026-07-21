// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { RelationshipsCountOutputTypeSelectObjectSchema } from './RelationshipsCountOutputTypeSelect.schema'

export const RelationshipsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => RelationshipsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const RelationshipsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => RelationshipsCountOutputTypeSelectObjectSchema).optional()
}).strict();
