import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const evidence_itemsWhereUniqueInputObjectSchema: z.ZodType<Prisma.evidence_itemsWhereUniqueInput, Prisma.evidence_itemsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const evidence_itemsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
