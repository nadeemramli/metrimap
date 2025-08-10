import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NullableDateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput, Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const NullableDateTimeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
