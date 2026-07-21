// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema'

export const tag_audiencesScalarWhereInputObjectSchema: z.ZodType<Prisma.tag_audiencesScalarWhereInput, Prisma.tag_audiencesScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional()
}).strict();
export const tag_audiencesScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional()
}).strict();
