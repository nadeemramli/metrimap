// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const RelationshipsListRelationFilterObjectSchema: z.ZodType<Prisma.RelationshipsListRelationFilter, Prisma.RelationshipsListRelationFilter> = z.object({
  every: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
export const RelationshipsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
