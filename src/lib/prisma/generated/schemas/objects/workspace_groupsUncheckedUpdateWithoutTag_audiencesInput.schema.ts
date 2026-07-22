// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { group_membersUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './group_membersUncheckedUpdateManyWithoutWorkspace_groupsNestedInput.schema';
import { node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema } from './node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInput.schema'

export const workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsUncheckedUpdateWithoutTag_audiencesInput, Prisma.workspace_groupsUncheckedUpdateWithoutTag_audiencesInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_members: z.lazy(() => group_membersUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
export const workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_members: z.lazy(() => group_membersUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema).optional()
}).strict();
