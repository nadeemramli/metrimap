// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema } from './projectsCreateNestedOneWithoutRelationship_historyInput.schema'

export const relationship_historyCreateWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateWithoutRelationshipsInput, Prisma.relationship_historyCreateWithoutRelationshipsInput> = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema).optional()
}).strict();
export const relationship_historyCreateWithoutRelationshipsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema).optional()
}).strict();
