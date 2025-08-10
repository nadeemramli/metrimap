import { z } from 'zod';

export const NotificationsScalarFieldEnumSchema = z.enum(['id', 'user_id', 'type', 'title', 'description', 'read', 'metadata', 'created_at'])