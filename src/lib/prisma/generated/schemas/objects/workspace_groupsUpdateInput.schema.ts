// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { group_membersUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './group_membersUpdateManyWithoutWorkspace_groupsNestedInput.schema';
import { node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInput.schema';
import { tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInput.schema'

export const workspace_groupsUpdateInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateInput, Prisma.workspace_groupsUpdateInput> = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_members: z.lazy(() => group_membersUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
export const workspace_groupsUpdateInputObjectZodSchema = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_members: z.lazy(() => group_membersUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
