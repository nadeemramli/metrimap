// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { error_report_groupsSelectObjectSchema } from './error_report_groupsSelect.schema'

export const error_report_groupsArgsObjectSchema = z.object({
  select: z.lazy(() => error_report_groupsSelectObjectSchema).optional()
}).strict();
export const error_report_groupsArgsObjectZodSchema = z.object({
  select: z.lazy(() => error_report_groupsSelectObjectSchema).optional()
}).strict();
