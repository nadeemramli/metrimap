// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutEvidence_itemsInputObjectSchema } from './projectsCreateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './projectsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutEvidence_itemsInput, Prisma.projectsCreateNestedOneWithoutEvidence_itemsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutEvidence_itemsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
