// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesEvent_idKeyCompoundUniqueInputObjectSchema } from './event_propertiesEvent_idKeyCompoundUniqueInput.schema'

export const event_propertiesWhereUniqueInputObjectSchema: z.ZodType<Prisma.event_propertiesWhereUniqueInput, Prisma.event_propertiesWhereUniqueInput> = z.object({
  id: z.string(),
  event_id_key: z.lazy(() => event_propertiesEvent_idKeyCompoundUniqueInputObjectSchema)
}).strict();
export const event_propertiesWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  event_id_key: z.lazy(() => event_propertiesEvent_idKeyCompoundUniqueInputObjectSchema)
}).strict();
