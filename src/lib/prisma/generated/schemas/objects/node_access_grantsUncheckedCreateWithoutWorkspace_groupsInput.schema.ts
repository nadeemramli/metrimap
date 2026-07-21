// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedCreateWithoutWorkspace_groupsInput, Prisma.node_access_grantsUncheckedCreateWithoutWorkspace_groupsInput> = z.object({
  metric_card_id: z.string()
}).strict();
export const node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  metric_card_id: z.string()
}).strict();
