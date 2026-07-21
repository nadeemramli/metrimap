// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUpdateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutWorkspace_groupsInput.schema'

export const tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
