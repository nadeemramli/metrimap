import { z } from 'zod';

export const Metric_cardsScalarFieldEnumSchema = z.enum(['id', 'project_id', 'title', 'description', 'category', 'sub_category', 'position_x', 'position_y', 'data', 'source_type', 'formula', 'causal_factors', 'dimensions', 'owner_id', 'assignees', 'created_at', 'updated_at', 'created_by'])