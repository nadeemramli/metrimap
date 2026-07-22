// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsCreateWithoutCommentsInputObjectSchema } from './comment_mentionsCreateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateWithoutCommentsInput.schema';
import { comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_mentionsCreateOrConnectWithoutCommentsInput.schema';
import { comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema } from './comment_mentionsCreateManyCommentsInputEnvelope.schema';
import { comment_mentionsWhereUniqueInputObjectSchema } from './comment_mentionsWhereUniqueInput.schema'

export const comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateNestedManyWithoutCommentsInput, Prisma.comment_mentionsCreateNestedManyWithoutCommentsInput> = z.object({
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const comment_mentionsCreateNestedManyWithoutCommentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
