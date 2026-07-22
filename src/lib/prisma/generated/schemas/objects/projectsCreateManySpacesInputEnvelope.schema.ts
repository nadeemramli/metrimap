// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateManySpacesInputObjectSchema } from './projectsCreateManySpacesInput.schema'

export const projectsCreateManySpacesInputEnvelopeObjectSchema: z.ZodType<Prisma.projectsCreateManySpacesInputEnvelope, Prisma.projectsCreateManySpacesInputEnvelope> = z.object({
  data: z.union([z.lazy(() => projectsCreateManySpacesInputObjectSchema), z.lazy(() => projectsCreateManySpacesInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const projectsCreateManySpacesInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => projectsCreateManySpacesInputObjectSchema), z.lazy(() => projectsCreateManySpacesInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
