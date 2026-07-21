// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutProjectsInputObjectSchema } from './relationshipsCreateWithoutProjectsInput.schema';
import { relationshipsUncheckedCreateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedCreateWithoutProjectsInput.schema';
import { relationshipsCreateOrConnectWithoutProjectsInputObjectSchema } from './relationshipsCreateOrConnectWithoutProjectsInput.schema';
import { relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './relationshipsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { relationshipsCreateManyProjectsInputEnvelopeObjectSchema } from './relationshipsCreateManyProjectsInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './relationshipsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './relationshipsUpdateManyWithWhereWithoutProjectsInput.schema';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema'

export const relationshipsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithoutProjectsNestedInput, Prisma.relationshipsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
