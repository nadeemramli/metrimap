import { z } from 'zod';

export const UsersScalarFieldEnumSchema = z.enum(['id', 'email', 'name', 'avatar_url', 'created_at', 'updated_at'])