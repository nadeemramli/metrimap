import { z } from 'zod';

export const CommentsScalarFieldEnumSchema = z.enum(['id', 'thread_id', 'author_id', 'content', 'resolved', 'created_at', 'updated_at'])