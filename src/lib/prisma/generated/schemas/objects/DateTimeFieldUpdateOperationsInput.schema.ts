import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const DateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const DateTimeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
