// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUpdateWithoutTag_audiencesInput.schema';
import { tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedUpdateWithoutTag_audiencesInput.schema';
import { tagsCreateWithoutTag_audiencesInputObjectSchema } from './tagsCreateWithoutTag_audiencesInput.schema';
import { tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedCreateWithoutTag_audiencesInput.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const tagsUpsertWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsUpsertWithoutTag_audiencesInput, Prisma.tagsUpsertWithoutTag_audiencesInput> = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
export const tagsUpsertWithoutTag_audiencesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
