// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateNestedOneWithoutRelationship_historyInput.schema'

export const relationship_historyCreateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateWithoutProjectsInput, Prisma.relationship_historyCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema)
}).strict();
export const relationship_historyCreateWithoutProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema)
}).strict();
