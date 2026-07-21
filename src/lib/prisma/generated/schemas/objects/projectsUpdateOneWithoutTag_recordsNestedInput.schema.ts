// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutTag_recordsInputObjectSchema } from './projectsCreateWithoutTag_recordsInput.schema';
import { projectsUncheckedCreateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedCreateWithoutTag_recordsInput.schema';
import { projectsCreateOrConnectWithoutTag_recordsInputObjectSchema } from './projectsCreateOrConnectWithoutTag_recordsInput.schema';
import { projectsUpsertWithoutTag_recordsInputObjectSchema } from './projectsUpsertWithoutTag_recordsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutTag_recordsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutTag_recordsInput.schema';
import { projectsUpdateWithoutTag_recordsInputObjectSchema } from './projectsUpdateWithoutTag_recordsInput.schema';
import { projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedUpdateWithoutTag_recordsInput.schema'

export const projectsUpdateOneWithoutTag_recordsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutTag_recordsNestedInput, Prisma.projectsUpdateOneWithoutTag_recordsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutTag_recordsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutTag_recordsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutTag_recordsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutTag_recordsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutTag_recordsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)]).optional()
}).strict();
