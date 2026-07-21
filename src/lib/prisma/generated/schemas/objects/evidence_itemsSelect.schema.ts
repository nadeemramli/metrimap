// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema'

export const evidence_itemsSelectObjectSchema: z.ZodType<Prisma.evidence_itemsSelect, Prisma.evidence_itemsSelect> = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  date: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  link: z.boolean().optional(),
  hypothesis: z.boolean().optional(),
  summary: z.boolean().optional(),
  impact_on_confidence: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional(),
  card_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  content: z.boolean().optional(),
  is_public: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  users_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
export const evidence_itemsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  date: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  link: z.boolean().optional(),
  hypothesis: z.boolean().optional(),
  summary: z.boolean().optional(),
  impact_on_confidence: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional(),
  card_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  content: z.boolean().optional(),
  is_public: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  users_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
