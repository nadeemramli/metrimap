// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateManyWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateManyWorkspace_groupsInput.schema'

export const node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema: z.ZodType<Prisma.node_access_grantsCreateManyWorkspace_groupsInputEnvelope, Prisma.node_access_grantsCreateManyWorkspace_groupsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
