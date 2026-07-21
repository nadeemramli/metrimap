// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutComment_threadsInputObjectSchema } from './projectsUpdateWithoutComment_threadsInput.schema';
import { projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedUpdateWithoutComment_threadsInput.schema'

export const projectsUpdateToOneWithWhereWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutComment_threadsInput, Prisma.projectsUpdateToOneWithWhereWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)])
}).strict();
