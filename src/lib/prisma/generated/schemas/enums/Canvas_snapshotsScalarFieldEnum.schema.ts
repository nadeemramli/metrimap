// @ts-nocheck
import { z } from 'zod';

export const Canvas_snapshotsScalarFieldEnumSchema = z.enum(['id', 'canvas_id', 'version', 'title', 'description', 'nodes', 'edges', 'groups', 'metadata', 'created_by', 'created_at', 'updated_at'])