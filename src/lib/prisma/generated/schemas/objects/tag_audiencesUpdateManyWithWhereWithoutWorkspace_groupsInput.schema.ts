// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesScalarWhereInputObjectSchema } from './tag_audiencesScalarWhereInput.schema';
import { tag_audiencesUpdateManyMutationInputObjectSchema } from './tag_audiencesUpdateManyMutationInput.schema';
import { tag_audiencesUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedUpdateManyWithoutWorkspace_groupsInput.schema'

export const tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInput, Prisma.tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateManyMutationInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateManyMutationInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
