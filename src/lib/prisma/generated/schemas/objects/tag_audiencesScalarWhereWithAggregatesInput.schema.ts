// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema'

export const tag_audiencesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.tag_audiencesScalarWhereWithAggregatesInput, Prisma.tag_audiencesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const tag_audiencesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
