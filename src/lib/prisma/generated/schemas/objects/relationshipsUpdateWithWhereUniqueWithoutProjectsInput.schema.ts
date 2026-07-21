// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutProjectsInputObjectSchema } from './relationshipsUpdateWithoutProjectsInput.schema';
import { relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutProjectsInput.schema'

export const relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.relationshipsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationshipsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
