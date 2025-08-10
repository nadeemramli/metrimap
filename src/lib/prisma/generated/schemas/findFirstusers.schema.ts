import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { usersOrderByWithRelationInputObjectSchema } from './objects/usersOrderByWithRelationInput.schema';
import { usersWhereInputObjectSchema } from './objects/usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './objects/usersWhereUniqueInput.schema';
import { usersScalarFieldEnumSchema } from './enums/usersScalarFieldEnum.schema'

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const usersFindFirstSelectSchema: z.ZodType<Prisma.usersSelect, Prisma.usersSelect> = z.object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    name: z.boolean().optional(),
    avatar_url: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional()
  }).strict();

export const usersFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    name: z.boolean().optional(),
    avatar_url: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional()
  }).strict();

export const usersFindFirstSchema: z.ZodType<Prisma.usersFindFirstArgs, Prisma.usersFindFirstArgs> = z.object({ select: usersFindFirstSelectSchema.optional(),  orderBy: z.union([usersOrderByWithRelationInputObjectSchema, usersOrderByWithRelationInputObjectSchema.array()]).optional(), where: usersWhereInputObjectSchema.optional(), cursor: usersWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([usersScalarFieldEnumSchema, usersScalarFieldEnumSchema.array()]).optional() }).strict();

export const usersFindFirstZodSchema = z.object({ select: usersFindFirstSelectSchema.optional(),  orderBy: z.union([usersOrderByWithRelationInputObjectSchema, usersOrderByWithRelationInputObjectSchema.array()]).optional(), where: usersWhereInputObjectSchema.optional(), cursor: usersWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([usersScalarFieldEnumSchema, usersScalarFieldEnumSchema.array()]).optional() }).strict();