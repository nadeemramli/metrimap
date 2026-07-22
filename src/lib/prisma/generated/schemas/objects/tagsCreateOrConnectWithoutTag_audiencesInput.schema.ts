// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsCreateWithoutTag_audiencesInputObjectSchema } from './tagsCreateWithoutTag_audiencesInput.schema';
import { tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedCreateWithoutTag_audiencesInput.schema'

export const tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsCreateOrConnectWithoutTag_audiencesInput, Prisma.tagsCreateOrConnectWithoutTag_audiencesInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)])
}).strict();
export const tagsCreateOrConnectWithoutTag_audiencesInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)])
}).strict();
