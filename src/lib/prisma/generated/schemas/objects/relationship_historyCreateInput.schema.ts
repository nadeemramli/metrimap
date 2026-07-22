// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema } from './projectsCreateNestedOneWithoutRelationship_historyInput.schema';
import { relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateNestedOneWithoutRelationship_historyInput.schema'

export const relationship_historyCreateInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateInput, Prisma.relationship_historyCreateInput> = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema)
}).strict();
export const relationship_historyCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema)
}).strict();
