import { z } from 'zod';

export const ChangelogScalarFieldEnumSchema = z.enum(['id', 'project_id', 'user_id', 'action', 'target', 'target_id', 'target_name', 'description', 'metadata', 'timestamp'])