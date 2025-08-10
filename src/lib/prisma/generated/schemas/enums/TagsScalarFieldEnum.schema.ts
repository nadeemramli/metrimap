import { z } from 'zod';

export const TagsScalarFieldEnumSchema = z.enum(['id', 'name', 'color', 'description', 'project_id', 'created_by', 'created_at', 'updated_at'])