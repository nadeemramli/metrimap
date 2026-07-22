// @ts-nocheck
import { z } from 'zod';

export const SpacesScalarFieldEnumSchema = z.enum(['id', 'created_by', 'name', 'color', 'sort_order', 'created_at', 'updated_at', 'workspace_id'])