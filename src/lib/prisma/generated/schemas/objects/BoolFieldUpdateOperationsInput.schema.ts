import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const BoolFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput, Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();
export const BoolFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.boolean().optional()
}).strict();
