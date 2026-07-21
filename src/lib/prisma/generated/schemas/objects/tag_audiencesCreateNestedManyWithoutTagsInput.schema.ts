// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateWithoutTagsInputObjectSchema } from './tag_audiencesCreateWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutTagsInput.schema';
import { tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema } from './tag_audiencesCreateOrConnectWithoutTagsInput.schema';
import { tag_audiencesCreateManyTagsInputEnvelopeObjectSchema } from './tag_audiencesCreateManyTagsInputEnvelope.schema';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema'

export const tag_audiencesCreateNestedManyWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateNestedManyWithoutTagsInput, Prisma.tag_audiencesCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const tag_audiencesCreateNestedManyWithoutTagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
