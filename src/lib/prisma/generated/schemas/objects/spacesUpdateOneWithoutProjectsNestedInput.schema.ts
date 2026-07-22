// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesCreateWithoutProjectsInputObjectSchema } from './spacesCreateWithoutProjectsInput.schema';
import { spacesUncheckedCreateWithoutProjectsInputObjectSchema } from './spacesUncheckedCreateWithoutProjectsInput.schema';
import { spacesCreateOrConnectWithoutProjectsInputObjectSchema } from './spacesCreateOrConnectWithoutProjectsInput.schema';
import { spacesUpsertWithoutProjectsInputObjectSchema } from './spacesUpsertWithoutProjectsInput.schema';
import { spacesWhereInputObjectSchema } from './spacesWhereInput.schema';
import { spacesWhereUniqueInputObjectSchema } from './spacesWhereUniqueInput.schema';
import { spacesUpdateToOneWithWhereWithoutProjectsInputObjectSchema } from './spacesUpdateToOneWithWhereWithoutProjectsInput.schema';
import { spacesUpdateWithoutProjectsInputObjectSchema } from './spacesUpdateWithoutProjectsInput.schema';
import { spacesUncheckedUpdateWithoutProjectsInputObjectSchema } from './spacesUncheckedUpdateWithoutProjectsInput.schema'

export const spacesUpdateOneWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.spacesUpdateOneWithoutProjectsNestedInput, Prisma.spacesUpdateOneWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => spacesCreateOrConnectWithoutProjectsInputObjectSchema).optional(),
  upsert: z.lazy(() => spacesUpsertWithoutProjectsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => spacesWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => spacesWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => spacesWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => spacesUpdateToOneWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)]).optional()
}).strict();
export const spacesUpdateOneWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => spacesCreateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedCreateWithoutProjectsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => spacesCreateOrConnectWithoutProjectsInputObjectSchema).optional(),
  upsert: z.lazy(() => spacesUpsertWithoutProjectsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => spacesWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => spacesWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => spacesWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => spacesUpdateToOneWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => spacesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => spacesUncheckedUpdateWithoutProjectsInputObjectSchema)]).optional()
}).strict();
