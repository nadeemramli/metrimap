import { z } from 'zod';

export const ProjectsScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'tags', 'settings', 'created_at', 'updated_at', 'last_modified_by', 'created_by', 'is_public'])