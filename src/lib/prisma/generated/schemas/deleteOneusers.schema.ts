// @ts-nocheck
import { z } from 'zod';
import { usersSelectObjectSchema } from './objects/usersSelect.schema.js';
import { usersWhereUniqueInputObjectSchema } from './objects/usersWhereUniqueInput.schema'

export const usersDeleteOneSchema = z.object({ select: usersSelectObjectSchema.optional(),  where: usersWhereUniqueInputObjectSchema  })