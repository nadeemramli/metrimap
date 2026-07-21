// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutProjectsInputObjectSchema } from './relationshipsCreateWithoutProjectsInput.schema';
import { relationshipsUncheckedCreateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedCreateWithoutProjectsInput.schema'

export const relationshipsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutProjectsInput, Prisma.relationshipsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
