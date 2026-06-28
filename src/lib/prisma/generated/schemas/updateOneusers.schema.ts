// @ts-nocheck
import { z } from 'zod';
import { usersSelectObjectSchema } from './objects/usersSelect.schema.js';
import { usersUpdateInputObjectSchema } from './objects/usersUpdateInput.schema';
import { usersUncheckedUpdateInputObjectSchema } from './objects/usersUncheckedUpdateInput.schema';
import { usersWhereUniqueInputObjectSchema } from './objects/usersWhereUniqueInput.schema'

export const usersUpdateOneSchema = z.object({ select: usersSelectObjectSchema.optional(),  data: z.union([usersUpdateInputObjectSchema, usersUncheckedUpdateInputObjectSchema]), where: usersWhereUniqueInputObjectSchema  })