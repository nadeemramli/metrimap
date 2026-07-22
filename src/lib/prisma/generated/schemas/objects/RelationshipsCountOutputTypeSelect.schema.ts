// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const RelationshipsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.RelationshipsCountOutputTypeSelect, Prisma.RelationshipsCountOutputTypeSelect> = z.object({
  evidence_items: z.boolean().optional(),
  relationship_history: z.boolean().optional(),
  relationship_tags: z.boolean().optional()
}).strict();
export const RelationshipsCountOutputTypeSelectObjectZodSchema = z.object({
  evidence_items: z.boolean().optional(),
  relationship_history: z.boolean().optional(),
  relationship_tags: z.boolean().optional()
}).strict();
