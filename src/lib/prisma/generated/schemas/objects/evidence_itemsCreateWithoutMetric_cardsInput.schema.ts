// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema } from './projectsCreateNestedOneWithoutEvidence_itemsInput.schema';
import { relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateNestedOneWithoutEvidence_itemsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const evidence_itemsCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateWithoutMetric_cardsInput, Prisma.evidence_itemsCreateWithoutMetric_cardsInput> = z.object({
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
  users_evidence_items_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema),
  users_evidence_items_owner_idTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional()
}).strict();
export const evidence_itemsCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
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
  users_evidence_items_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema),
  users_evidence_items_owner_idTousers: z.lazy(() => usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema).optional()
}).strict();
