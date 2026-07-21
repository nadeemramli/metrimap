// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema';
import { tagsArgsObjectSchema } from './tagsArgs.schema'

export const relationship_tagsSelectObjectSchema: z.ZodType<Prisma.relationship_tagsSelect, Prisma.relationship_tagsSelect> = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
export const relationship_tagsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
