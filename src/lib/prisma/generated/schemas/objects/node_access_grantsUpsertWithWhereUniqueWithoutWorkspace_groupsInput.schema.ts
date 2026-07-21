// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUpdateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutWorkspace_groupsInput.schema'

export const node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
