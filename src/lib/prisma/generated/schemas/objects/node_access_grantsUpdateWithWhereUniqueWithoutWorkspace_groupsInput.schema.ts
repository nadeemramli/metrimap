// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUpdateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInput.schema'

export const node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
