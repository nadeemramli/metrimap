// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUpdateWithoutEvidence_itemsInput.schema';
import { projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './projectsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const projectsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutEvidence_itemsInput, Prisma.projectsUpdateToOneWithWhereWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
