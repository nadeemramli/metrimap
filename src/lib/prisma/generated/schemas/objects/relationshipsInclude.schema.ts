// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Evidence_itemsFindManySchema } from '../findManyevidence_items.schema';
import { Relationship_historyFindManySchema } from '../findManyrelationship_history.schema';
import { Relationship_tagsFindManySchema } from '../findManyrelationship_tags.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { relationshipsCountOutputTypeArgsObjectSchema } from './relationshipsCountOutputTypeArgs.schema'

export const relationshipsIncludeObjectSchema: z.ZodType<Prisma.relationshipsInclude, Prisma.relationshipsInclude> = z.object({
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  relationship_history: z.union([z.boolean(), z.lazy(() => Relationship_historyFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards_relationships_source_idTometric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  metric_cards_relationships_target_idTometric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => relationshipsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const relationshipsIncludeObjectZodSchema = z.object({
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  relationship_history: z.union([z.boolean(), z.lazy(() => Relationship_historyFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards_relationships_source_idTometric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  metric_cards_relationships_target_idTometric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => relationshipsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
