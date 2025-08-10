import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const project_collaboratorsWhereUniqueInputObjectSchema: z.ZodType<Prisma.project_collaboratorsWhereUniqueInput, Prisma.project_collaboratorsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const project_collaboratorsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
