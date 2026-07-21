// @ts-nocheck
import { z } from 'zod';

export const Strategy_impact_contractsScalarFieldEnumSchema = z.enum(['id', 'workspace_id', 'project_id', 'strategy_node_id', 'expected_direction', 'expected_delta_value', 'expected_delta_unit', 'baseline_start', 'baseline_end', 'measure_start', 'measure_end', 'baseline_is_manual', 'confidence', 'impact_status', 'owner_label', 'result_note', 'created_by', 'created_at', 'updated_at'])