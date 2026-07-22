// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { usersCreateNestedOneWithoutChangelogInputObjectSchema } from './usersCreateNestedOneWithoutChangelogInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const changelogCreateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogCreateWithoutProjectsInput, Prisma.changelogCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  action: z.string(),
  target: z.string(),
  target_id: z.string().optional().nullable(),
  target_name: z.string(),
  description: z.string(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  timestamp: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  users: z.lazy(() => usersCreateNestedOneWithoutChangelogInputObjectSchema).optional()
}).strict();
export const changelogCreateWithoutProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  action: z.string(),
  target: z.string(),
  target_id: z.string().optional().nullable(),
  target_name: z.string(),
  description: z.string(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  timestamp: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  users: z.lazy(() => usersCreateNestedOneWithoutChangelogInputObjectSchema).optional()
}).strict();
