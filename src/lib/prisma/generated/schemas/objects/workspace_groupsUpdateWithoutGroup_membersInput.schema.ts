// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInput.schema';
import { tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInput.schema'

export const workspace_groupsUpdateWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateWithoutGroup_membersInput, Prisma.workspace_groupsUpdateWithoutGroup_membersInput> = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
export const workspace_groupsUpdateWithoutGroup_membersInputObjectZodSchema = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
