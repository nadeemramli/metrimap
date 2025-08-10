import { z } from 'zod';
import { usersWhereInputObjectSchema } from './objects/usersWhereInput.schema'

export const usersDeleteManySchema = z.object({ where: usersWhereInputObjectSchema.optional()  })