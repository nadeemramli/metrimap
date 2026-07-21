// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema'

export const evidence_itemsIncludeObjectSchema: z.ZodType<Prisma.evidence_itemsInclude, Prisma.evidence_itemsInclude> = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  users_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
export const evidence_itemsIncludeObjectZodSchema = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  users_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
