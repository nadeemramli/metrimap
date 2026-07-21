// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsCreateWithoutProjectsInputObjectSchema } from './comment_threadsCreateWithoutProjectsInput.schema';
import { comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutProjectsInput.schema';
import { comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema } from './comment_threadsCreateOrConnectWithoutProjectsInput.schema';
import { comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './comment_threadsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { comment_threadsCreateManyProjectsInputEnvelopeObjectSchema } from './comment_threadsCreateManyProjectsInputEnvelope.schema';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './comment_threadsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './comment_threadsUpdateManyWithWhereWithoutProjectsInput.schema';
import { comment_threadsScalarWhereInputObjectSchema } from './comment_threadsScalarWhereInput.schema'

export const comment_threadsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.comment_threadsUpdateManyWithoutProjectsNestedInput, Prisma.comment_threadsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_threadsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_threadsScalarWhereInputObjectSchema), z.lazy(() => comment_threadsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const comment_threadsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_threadsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_threadsWhereUniqueInputObjectSchema), z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_threadsScalarWhereInputObjectSchema), z.lazy(() => comment_threadsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
