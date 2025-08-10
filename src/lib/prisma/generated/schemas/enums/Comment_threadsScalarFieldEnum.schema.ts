import { z } from 'zod';

export const Comment_threadsScalarFieldEnumSchema = z.enum(['id', 'project_id', 'source', 'context', 'is_resolved', 'created_by', 'created_at', 'updated_at'])