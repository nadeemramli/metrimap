import { z } from 'zod';
import { usersUpdateManyMutationInputObjectSchema } from './objects/usersUpdateManyMutationInput.schema';
import { usersWhereInputObjectSchema } from './objects/usersWhereInput.schema'

export const usersUpdateManySchema = z.object({ data: usersUpdateManyMutationInputObjectSchema, where: usersWhereInputObjectSchema.optional()  })