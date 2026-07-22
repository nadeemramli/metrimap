// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsScalarWhereInputObjectSchema } from './node_access_grantsScalarWhereInput.schema';
import { node_access_grantsUpdateManyMutationInputObjectSchema } from './node_access_grantsUpdateManyMutationInput.schema';
import { node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsInput.schema'

export const node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInput, Prisma.node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateManyMutationInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateManyMutationInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
