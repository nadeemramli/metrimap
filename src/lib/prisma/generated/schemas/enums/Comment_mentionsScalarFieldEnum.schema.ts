import { z } from 'zod';

export const Comment_mentionsScalarFieldEnumSchema = z.enum(['id', 'comment_id', 'mentioned_user_id', 'created_at'])