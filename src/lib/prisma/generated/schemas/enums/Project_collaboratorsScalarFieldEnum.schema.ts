import { z } from 'zod';

export const Project_collaboratorsScalarFieldEnumSchema = z.enum(['id', 'project_id', 'user_id', 'role', 'permissions', 'invited_at', 'joined_at'])