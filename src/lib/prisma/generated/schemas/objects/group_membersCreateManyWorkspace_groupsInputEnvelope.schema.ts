// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersCreateManyWorkspace_groupsInputObjectSchema } from './group_membersCreateManyWorkspace_groupsInput.schema'

export const group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema: z.ZodType<Prisma.group_membersCreateManyWorkspace_groupsInputEnvelope, Prisma.group_membersCreateManyWorkspace_groupsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => group_membersCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const group_membersCreateManyWorkspace_groupsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => group_membersCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
