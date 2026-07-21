// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUpdateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInput.schema'

export const tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
