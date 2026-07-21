// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsCreateWithoutTagsInputObjectSchema } from './relationship_tagsCreateWithoutTagsInput.schema';
import { relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutTagsInput.schema'

export const relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateOrConnectWithoutTagsInput, Prisma.relationship_tagsCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const relationship_tagsCreateOrConnectWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
