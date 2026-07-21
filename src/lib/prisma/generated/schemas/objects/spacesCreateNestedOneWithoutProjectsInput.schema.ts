// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesCreateWithoutProjectsInputObjectSchema } from './spacesCreateWithoutProjectsInput.schema';
import { spacesUncheckedCreateWithoutProjectsInputObjectSchema } from './spacesUncheckedCreateWithoutProjectsInput.schema';
import { spacesCreateOrConnectWithoutProjectsInputObjectSchema } from './spacesCreateOrConnectWithoutProjectsInput.schema';
import { spacesWhereUniqueInputObjectSchema } from './spacesWhereUniqueInput.schema'

export const spacesCreateNestedOneWithoutProjectsInputObjectSchema: z.ZodType<Prisma.spacesCreateNestedOneWithoutProjectsInput, Prisma.spacesCreateNestedOneWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => spacesCreateOrConnectWithoutProjectsInputObjectSchema).optional(),
  connect: z.lazy(() => spacesWhereUniqueInputObjectSchema).optional()
}).strict();
export const spacesCreateNestedOneWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => spacesCreateOrConnectWithoutProjectsInputObjectSchema).optional(),
  connect: z.lazy(() => spacesWhereUniqueInputObjectSchema).optional()
}).strict();
