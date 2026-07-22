// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsCreateWithoutProjectsInputObjectSchema } from './comment_threadsCreateWithoutProjectsInput.schema';
import { comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutProjectsInput.schema';
import { comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema } from './comment_threadsCreateOrConnectWithoutProjectsInput.schema';
import { comment_threadsCreateManyProjectsInputEnvelopeObjectSchema } from './comment_threadsCreateManyProjectsInputEnvelope.schema';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema'

export const comment_threadsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsCreateNestedManyWithoutProjectsInput, Prisma.comment_threadsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_threadsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const comment_threadsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_threadsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
