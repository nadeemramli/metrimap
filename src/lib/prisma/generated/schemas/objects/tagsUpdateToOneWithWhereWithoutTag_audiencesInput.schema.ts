// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema';
import { tagsUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUpdateWithoutTag_audiencesInput.schema';
import { tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedUpdateWithoutTag_audiencesInput.schema'

export const tagsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsUpdateToOneWithWhereWithoutTag_audiencesInput, Prisma.tagsUpdateToOneWithWhereWithoutTag_audiencesInput> = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)])
}).strict();
export const tagsUpdateToOneWithWhereWithoutTag_audiencesInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)])
}).strict();
