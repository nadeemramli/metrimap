// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsCreateNestedOneWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutEvidence_itemsInput.schema';
import { usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema } from './projectsCreateNestedOneWithoutEvidence_itemsInput.schema';
import { relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateNestedOneWithoutEvidence_itemsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInput, Prisma.evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.boolean().optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema),
  projects: z.lazy(() => projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional()
}).strict();
export const evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.boolean().optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema),
  projects: z.lazy(() => projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional()
}).strict();
