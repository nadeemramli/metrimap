// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutProjectsInputObjectSchema } from './relationshipsUpdateWithoutProjectsInput.schema';
import { relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutProjectsInput.schema';
import { relationshipsCreateWithoutProjectsInputObjectSchema } from './relationshipsCreateWithoutProjectsInput.schema';
import { relationshipsUncheckedCreateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedCreateWithoutProjectsInput.schema'

export const relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.relationshipsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationshipsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
