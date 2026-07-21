// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateNestedOneWithoutNode_access_grantsInput.schema'

export const node_access_grantsCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsCreateWithoutMetric_cardsInput, Prisma.node_access_grantsCreateWithoutMetric_cardsInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
export const node_access_grantsCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
