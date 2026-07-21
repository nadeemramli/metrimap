// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUpdateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedUpdateWithoutEvidence_itemsInput.schema';
import { projectsCreateWithoutEvidence_itemsInputObjectSchema } from './projectsCreateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutEvidence_itemsInput, Prisma.projectsUpsertWithoutEvidence_itemsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutEvidence_itemsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
