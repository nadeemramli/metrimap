// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateManyUsers_projects_created_byTousersInputObjectSchema } from './projectsCreateManyUsers_projects_created_byTousersInput.schema'

export const projectsCreateManyUsers_projects_created_byTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.projectsCreateManyUsers_projects_created_byTousersInputEnvelope, Prisma.projectsCreateManyUsers_projects_created_byTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const projectsCreateManyUsers_projects_created_byTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
