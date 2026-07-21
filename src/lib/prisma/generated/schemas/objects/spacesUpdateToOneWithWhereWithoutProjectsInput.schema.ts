// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesWhereInputObjectSchema } from './spacesWhereInput.schema';
import { spacesUpdateWithoutProjectsInputObjectSchema } from './spacesUpdateWithoutProjectsInput.schema';
import { spacesUncheckedUpdateWithoutProjectsInputObjectSchema } from './spacesUncheckedUpdateWithoutProjectsInput.schema'

export const spacesUpdateToOneWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.spacesUpdateToOneWithWhereWithoutProjectsInput, Prisma.spacesUpdateToOneWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => spacesWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const spacesUpdateToOneWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => spacesWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
