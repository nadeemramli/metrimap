// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutTag_audiencesInputObjectSchema } from './tagsCreateWithoutTag_audiencesInput.schema';
import { tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedCreateWithoutTag_audiencesInput.schema';
import { tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema } from './tagsCreateOrConnectWithoutTag_audiencesInput.schema';
import { tagsUpsertWithoutTag_audiencesInputObjectSchema } from './tagsUpsertWithoutTag_audiencesInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema } from './tagsUpdateToOneWithWhereWithoutTag_audiencesInput.schema';
import { tagsUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUpdateWithoutTag_audiencesInput.schema';
import { tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './tagsUncheckedUpdateWithoutTag_audiencesInput.schema'

export const tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema: z.ZodType<Prisma.tagsUpdateOneRequiredWithoutTag_audiencesNestedInput, Prisma.tagsUpdateOneRequiredWithoutTag_audiencesNestedInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]).optional()
}).strict();
export const tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]).optional()
}).strict();
