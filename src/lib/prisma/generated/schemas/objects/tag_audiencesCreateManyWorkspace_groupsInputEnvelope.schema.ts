// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateManyWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateManyWorkspace_groupsInput.schema'

export const tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema: z.ZodType<Prisma.tag_audiencesCreateManyWorkspace_groupsInputEnvelope, Prisma.tag_audiencesCreateManyWorkspace_groupsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
