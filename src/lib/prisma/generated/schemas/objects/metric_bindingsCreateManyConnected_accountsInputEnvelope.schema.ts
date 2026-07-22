// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateManyConnected_accountsInputObjectSchema } from './metric_bindingsCreateManyConnected_accountsInput.schema'

export const metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_bindingsCreateManyConnected_accountsInputEnvelope, Prisma.metric_bindingsCreateManyConnected_accountsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_bindingsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_bindingsCreateManyConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateManyConnected_accountsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
