import { z } from 'zod';

export const Evidence_itemsScalarFieldEnumSchema = z.enum(['id', 'relationship_id', 'title', 'type', 'date', 'owner_id', 'link', 'hypothesis', 'summary', 'impact_on_confidence', 'created_at', 'updated_at', 'created_by'])