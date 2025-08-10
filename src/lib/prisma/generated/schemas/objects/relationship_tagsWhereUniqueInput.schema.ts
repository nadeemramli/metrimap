import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsWhereUniqueInputObjectSchema: z.ZodType<Prisma.relationship_tagsWhereUniqueInput, Prisma.relationship_tagsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const relationship_tagsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
