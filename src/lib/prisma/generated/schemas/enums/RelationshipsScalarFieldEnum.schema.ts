import { z } from 'zod';

export const RelationshipsScalarFieldEnumSchema = z.enum(['id', 'project_id', 'source_id', 'target_id', 'type', 'confidence', 'weight', 'created_at', 'updated_at', 'created_by'])