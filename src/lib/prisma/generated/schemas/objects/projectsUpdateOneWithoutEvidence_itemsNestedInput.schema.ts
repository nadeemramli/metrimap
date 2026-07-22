// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutEvidence_itemsInputObjectSchema } from './projectsCreateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './projectsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { projectsUpsertWithoutEvidence_itemsInputObjectSchema } from './projectsUpsertWithoutEvidence_itemsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutEvidence_itemsInput.schema';
import { projectsUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUpdateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const projectsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutEvidence_itemsNestedInput, Prisma.projectsUpdateOneWithoutEvidence_itemsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutEvidence_itemsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
