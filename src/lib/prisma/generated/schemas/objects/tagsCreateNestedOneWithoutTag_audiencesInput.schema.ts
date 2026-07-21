// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutTag_audiencesInputObjectSchema } from './tagsCreateWithoutTag_audiencesInput.schema';
import { tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedCreateWithoutTag_audiencesInput.schema';
import { tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema } from './tagsCreateOrConnectWithoutTag_audiencesInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema'

export const tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsCreateNestedOneWithoutTag_audiencesInput, Prisma.tagsCreateNestedOneWithoutTag_audiencesInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tagsCreateNestedOneWithoutTag_audiencesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
