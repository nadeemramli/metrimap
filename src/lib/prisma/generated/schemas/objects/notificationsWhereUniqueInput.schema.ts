import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const notificationsWhereUniqueInputObjectSchema: z.ZodType<Prisma.notificationsWhereUniqueInput, Prisma.notificationsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const notificationsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
