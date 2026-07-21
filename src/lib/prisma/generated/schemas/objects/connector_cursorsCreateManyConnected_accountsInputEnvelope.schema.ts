// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsCreateManyConnected_accountsInputObjectSchema } from './connector_cursorsCreateManyConnected_accountsInput.schema'

export const connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema: z.ZodType<Prisma.connector_cursorsCreateManyConnected_accountsInputEnvelope, Prisma.connector_cursorsCreateManyConnected_accountsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => connector_cursorsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => connector_cursorsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
