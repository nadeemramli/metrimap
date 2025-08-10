import { z } from 'zod';

export const GroupsScalarFieldEnumSchema = z.enum(['id', 'project_id', 'name', 'description', 'color', 'position_x', 'position_y', 'width', 'height', 'node_ids', 'created_at', 'updated_at', 'created_by'])