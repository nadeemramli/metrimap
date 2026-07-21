// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesWhereUniqueInputObjectSchema } from './spacesWhereUniqueInput.schema';
import { spacesCreateWithoutProjectsInputObjectSchema } from './spacesCreateWithoutProjectsInput.schema';
import { spacesUncheckedCreateWithoutProjectsInputObjectSchema } from './spacesUncheckedCreateWithoutProjectsInput.schema'

export const spacesCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.spacesCreateOrConnectWithoutProjectsInput, Prisma.spacesCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => spacesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const spacesCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => spacesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
