// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema } from './workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInput.schema'

export const node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateWithoutMetric_cardsInput, Prisma.node_access_grantsUpdateWithoutMetric_cardsInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
export const node_access_grantsUpdateWithoutMetric_cardsInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
