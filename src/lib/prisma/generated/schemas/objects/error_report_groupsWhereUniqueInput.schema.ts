// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_report_groupsWhereUniqueInputObjectSchema: z.ZodType<Prisma.error_report_groupsWhereUniqueInput, Prisma.error_report_groupsWhereUniqueInput> = z.object({
  fingerprint: z.string()
}).strict();
export const error_report_groupsWhereUniqueInputObjectZodSchema = z.object({
  fingerprint: z.string()
}).strict();
