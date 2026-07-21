// @ts-nocheck
import { z } from 'zod';

export const Alert_rulesScalarFieldEnumSchema = z.enum(['id', 'project_id', 'card_id', 'name', 'rule_type', 'config', 'enabled', 'created_by', 'last_triggered_at', 'last_triggered_value', 'created_at', 'updated_at'])