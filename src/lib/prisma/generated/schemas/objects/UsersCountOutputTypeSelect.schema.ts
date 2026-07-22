// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const UsersCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UsersCountOutputTypeSelect, Prisma.UsersCountOutputTypeSelect> = z.object({
  changelog: z.boolean().optional(),
  evidence_items_evidence_items_created_byTousers: z.boolean().optional(),
  evidence_items_evidence_items_owner_idTousers: z.boolean().optional(),
  groups: z.boolean().optional(),
  metric_cards_metric_cards_created_byTousers: z.boolean().optional(),
  metric_cards_metric_cards_owner_idTousers: z.boolean().optional(),
  project_collaborators: z.boolean().optional(),
  projects_projects_created_byTousers: z.boolean().optional(),
  projects_projects_last_modified_byTousers: z.boolean().optional(),
  relationships: z.boolean().optional(),
  tags: z.boolean().optional()
}).strict();
export const UsersCountOutputTypeSelectObjectZodSchema = z.object({
  changelog: z.boolean().optional(),
  evidence_items_evidence_items_created_byTousers: z.boolean().optional(),
  evidence_items_evidence_items_owner_idTousers: z.boolean().optional(),
  groups: z.boolean().optional(),
  metric_cards_metric_cards_created_byTousers: z.boolean().optional(),
  metric_cards_metric_cards_owner_idTousers: z.boolean().optional(),
  project_collaborators: z.boolean().optional(),
  projects_projects_created_byTousers: z.boolean().optional(),
  projects_projects_last_modified_byTousers: z.boolean().optional(),
  relationships: z.boolean().optional(),
  tags: z.boolean().optional()
}).strict();
