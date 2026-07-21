// @ts-nocheck
import { z } from 'zod';

export const Error_reportsScalarFieldEnumSchema = z.enum(['id', 'clerk_user_id', 'reporter_user_id', 'reporter_email', 'message', 'error_stack', 'component_stack', 'note', 'url', 'user_agent', 'client_time', 'created_at', 'fingerprint'])