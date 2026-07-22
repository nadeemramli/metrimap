// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutGroupsInputObjectSchema } from './projectsCreateWithoutGroupsInput.schema';
import { projectsUncheckedCreateWithoutGroupsInputObjectSchema } from './projectsUncheckedCreateWithoutGroupsInput.schema';
import { projectsCreateOrConnectWithoutGroupsInputObjectSchema } from './projectsCreateOrConnectWithoutGroupsInput.schema';
import { projectsUpsertWithoutGroupsInputObjectSchema } from './projectsUpsertWithoutGroupsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutGroupsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutGroupsInput.schema';
import { projectsUpdateWithoutGroupsInputObjectSchema } from './projectsUpdateWithoutGroupsInput.schema';
import { projectsUncheckedUpdateWithoutGroupsInputObjectSchema } from './projectsUncheckedUpdateWithoutGroupsInput.schema'

export const projectsUpdateOneWithoutGroupsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutGroupsNestedInput, Prisma.projectsUpdateOneWithoutGroupsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutGroupsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutGroupsInputObjectSchema), z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutGroupsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutGroupsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutGroupsInputObjectSchema), z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)]).optional()
}).strict();
