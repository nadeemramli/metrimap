// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_historyInput.schema';
import { relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateOrConnectWithoutRelationship_historyInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsCreateNestedOneWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.relationshipsCreateNestedOneWithoutRelationship_historyInput, Prisma.relationshipsCreateNestedOneWithoutRelationship_historyInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
export const relationshipsCreateNestedOneWithoutRelationship_historyInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
