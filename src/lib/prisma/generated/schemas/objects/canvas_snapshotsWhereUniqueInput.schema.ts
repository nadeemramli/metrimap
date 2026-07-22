// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const canvas_snapshotsWhereUniqueInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsWhereUniqueInput, Prisma.canvas_snapshotsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const canvas_snapshotsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
