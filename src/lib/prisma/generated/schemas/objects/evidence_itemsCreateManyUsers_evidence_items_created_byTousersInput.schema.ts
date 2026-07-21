// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyUsers_evidence_items_created_byTousersInput, Prisma.evidence_itemsCreateManyUsers_evidence_items_created_byTousersInput> = z.object({
  id: z.string().optional(),
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  card_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  card_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.boolean().optional()
}).strict();
