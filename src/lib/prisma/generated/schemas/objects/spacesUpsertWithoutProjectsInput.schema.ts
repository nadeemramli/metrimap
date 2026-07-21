// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesUpdateWithoutProjectsInputObjectSchema } from './spacesUpdateWithoutProjectsInput.schema';
import { spacesUncheckedUpdateWithoutProjectsInputObjectSchema } from './spacesUncheckedUpdateWithoutProjectsInput.schema';
import { spacesCreateWithoutProjectsInputObjectSchema } from './spacesCreateWithoutProjectsInput.schema';
import { spacesUncheckedCreateWithoutProjectsInputObjectSchema } from './spacesUncheckedCreateWithoutProjectsInput.schema';
import { spacesWhereInputObjectSchema } from './spacesWhereInput.schema'

export const spacesUpsertWithoutProjectsInputObjectSchema: z.ZodType<Prisma.spacesUpsertWithoutProjectsInput, Prisma.spacesUpsertWithoutProjectsInput> = z.object({
  update: z.union([z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]),
  where: z.lazy(() => spacesWhereInputObjectSchema).optional()
}).strict();
export const spacesUpsertWithoutProjectsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]),
  where: z.lazy(() => spacesWhereInputObjectSchema).optional()
}).strict();
