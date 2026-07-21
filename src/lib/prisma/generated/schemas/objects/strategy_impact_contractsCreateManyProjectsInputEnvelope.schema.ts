// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateManyProjectsInputObjectSchema } from './strategy_impact_contractsCreateManyProjectsInput.schema'

export const strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateManyProjectsInputEnvelope, Prisma.strategy_impact_contractsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => strategy_impact_contractsCreateManyProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => strategy_impact_contractsCreateManyProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
