// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema';
import { relationshipsUpdateManyMutationInputObjectSchema } from './relationshipsUpdateManyMutationInput.schema';
import { relationshipsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutProjectsInput.schema'

export const relationshipsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithWhereWithoutProjectsInput, Prisma.relationshipsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const relationshipsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
