// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateManyUsers_projects_last_modified_byTousersInput.schema'

export const projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelope, Prisma.projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
