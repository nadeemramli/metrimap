import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NullableStringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();
export const NullableStringFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.string().optional().nullable()
}).strict();
