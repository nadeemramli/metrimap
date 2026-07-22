// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsWhereInputObjectSchema } from './source_connectionsWhereInput.schema';
import { source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUpdateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedUpdateWithoutSource_connection_secretsInput.schema'

export const source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInputObjectSchema: z.ZodType<Prisma.source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInput, Prisma.source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInput> = z.object({
  where: z.lazy(() => source_connectionsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)])
}).strict();
export const source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInputObjectZodSchema = z.object({
  where: z.lazy(() => source_connectionsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)])
}).strict();
