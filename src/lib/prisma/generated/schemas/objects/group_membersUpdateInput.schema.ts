// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInputObjectSchema } from './workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInput.schema'

export const group_membersUpdateInputObjectSchema: z.ZodType<Prisma.group_membersUpdateInput, Prisma.group_membersUpdateInput> = z.object({
  user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  added_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  added_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInputObjectSchema).optional()
}).strict();
export const group_membersUpdateInputObjectZodSchema = z.object({
  user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  added_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  added_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInputObjectSchema).optional()
}).strict();
