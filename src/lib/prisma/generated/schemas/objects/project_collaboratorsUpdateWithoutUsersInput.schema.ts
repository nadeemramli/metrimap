// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { project_collaboratorsUpdatepermissionsInputObjectSchema } from './project_collaboratorsUpdatepermissionsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { projectsUpdateOneWithoutProject_collaboratorsNestedInputObjectSchema } from './projectsUpdateOneWithoutProject_collaboratorsNestedInput.schema'

export const project_collaboratorsUpdateWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateWithoutUsersInput, Prisma.project_collaboratorsUpdateWithoutUsersInput> = z.object({
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsUpdatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  joined_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  projects: z.lazy(() => projectsUpdateOneWithoutProject_collaboratorsNestedInputObjectSchema).optional()
}).strict();
export const project_collaboratorsUpdateWithoutUsersInputObjectZodSchema = z.object({
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsUpdatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  joined_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  projects: z.lazy(() => projectsUpdateOneWithoutProject_collaboratorsNestedInputObjectSchema).optional()
}).strict();
