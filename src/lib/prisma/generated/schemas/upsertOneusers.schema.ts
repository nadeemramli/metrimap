// @ts-nocheck
import { z } from 'zod';
import { usersSelectObjectSchema } from './objects/usersSelect.schema.js';
import { usersWhereUniqueInputObjectSchema } from './objects/usersWhereUniqueInput.schema';
import { usersCreateInputObjectSchema } from './objects/usersCreateInput.schema';
import { usersUncheckedCreateInputObjectSchema } from './objects/usersUncheckedCreateInput.schema';
import { usersUpdateInputObjectSchema } from './objects/usersUpdateInput.schema';
import { usersUncheckedUpdateInputObjectSchema } from './objects/usersUncheckedUpdateInput.schema'

export const usersUpsertSchema = z.object({ select: usersSelectObjectSchema.optional(),  where: usersWhereUniqueInputObjectSchema, create: z.union([ usersCreateInputObjectSchema, usersUncheckedCreateInputObjectSchema ]), update: z.union([ usersUpdateInputObjectSchema, usersUncheckedUpdateInputObjectSchema ])  })