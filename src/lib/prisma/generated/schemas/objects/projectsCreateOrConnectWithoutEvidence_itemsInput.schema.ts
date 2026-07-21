// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutEvidence_itemsInputObjectSchema } from './projectsCreateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedCreateWithoutEvidence_itemsInput.schema'

export const projectsCreateOrConnectWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutEvidence_itemsInput, Prisma.projectsCreateOrConnectWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
