// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutProjectsInputObjectSchema } from './relationshipsCreateWithoutProjectsInput.schema';
import { relationshipsUncheckedCreateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedCreateWithoutProjectsInput.schema';
import { relationshipsCreateOrConnectWithoutProjectsInputObjectSchema } from './relationshipsCreateOrConnectWithoutProjectsInput.schema';
import { relationshipsCreateManyProjectsInputEnvelopeObjectSchema } from './relationshipsCreateManyProjectsInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsUncheckedCreateNestedManyWithoutProjectsInput, Prisma.relationshipsUncheckedCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsUncheckedCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
