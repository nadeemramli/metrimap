// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsCreateManyConnected_accountsInputObjectSchema } from './connector_runsCreateManyConnected_accountsInput.schema'

export const connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema: z.ZodType<Prisma.connector_runsCreateManyConnected_accountsInputEnvelope, Prisma.connector_runsCreateManyConnected_accountsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => connector_runsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const connector_runsCreateManyConnected_accountsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => connector_runsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
