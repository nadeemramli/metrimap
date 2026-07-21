// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_historyInput.schema';
import { relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateOrConnectWithoutRelationship_historyInput.schema';
import { relationshipsUpsertWithoutRelationship_historyInputObjectSchema } from './relationshipsUpsertWithoutRelationship_historyInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema } from './relationshipsUpdateToOneWithWhereWithoutRelationship_historyInput.schema';
import { relationshipsUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUpdateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_historyInput.schema'

export const relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInput, Prisma.relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]).optional()
}).strict();
export const relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]).optional()
}).strict();
