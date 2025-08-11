-- Canvas Version History Migration
-- This creates the infrastructure for canvas snapshots and version history

-- Create canvas_snapshots table
CREATE TABLE IF NOT EXISTS public.canvas_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    canvas_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Canvas data at the time of snapshot
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    groups JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Snapshot metadata
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT canvas_snapshots_version_check CHECK (version > 0),
    CONSTRAINT canvas_snapshots_title_length CHECK (char_length(title) BETWEEN 1 AND 200),
    CONSTRAINT canvas_snapshots_description_length CHECK (char_length(description) <= 1000),
    
    -- Unique constraint for version per canvas
    UNIQUE(canvas_id, version)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_canvas_id ON public.canvas_snapshots(canvas_id);
CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_created_at ON public.canvas_snapshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_version ON public.canvas_snapshots(canvas_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_trigger_type ON public.canvas_snapshots USING GIN ((metadata->'triggerType'));
CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_created_by ON public.canvas_snapshots(created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_canvas_snapshots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_canvas_snapshots_updated_at ON public.canvas_snapshots;
CREATE TRIGGER update_canvas_snapshots_updated_at
    BEFORE UPDATE ON public.canvas_snapshots
    FOR EACH ROW
    EXECUTE PROCEDURE update_canvas_snapshots_updated_at();

-- Row Level Security (RLS)
ALTER TABLE public.canvas_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see snapshots for canvases they own or collaborate on
CREATE POLICY "canvas_snapshots_select_policy" ON public.canvas_snapshots
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = canvas_snapshots.canvas_id
            AND (
                p.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.project_collaborators pc
                    WHERE pc.project_id = p.id
                    AND pc.user_id = auth.uid()
                )
            )
        )
    );

-- Policy: Users can only create snapshots for canvases they own or collaborate on
CREATE POLICY "canvas_snapshots_insert_policy" ON public.canvas_snapshots
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = canvas_snapshots.canvas_id
            AND (
                p.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.project_collaborators pc
                    WHERE pc.project_id = p.id
                    AND pc.user_id = auth.uid()
                    AND pc.role IN ('owner', 'editor')
                )
            )
        )
        AND created_by = auth.uid()
    );

-- Policy: Users can only update snapshots they created
CREATE POLICY "canvas_snapshots_update_policy" ON public.canvas_snapshots
    FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Policy: Users can only delete snapshots they created for canvases they have access to
CREATE POLICY "canvas_snapshots_delete_policy" ON public.canvas_snapshots
    FOR DELETE
    USING (
        created_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = canvas_snapshots.canvas_id
            AND (
                p.created_by = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.project_collaborators pc
                    WHERE pc.project_id = p.id
                    AND pc.user_id = auth.uid()
                    AND pc.role IN ('owner', 'editor')
                )
            )
        )
    );

-- Create view for snapshot statistics
CREATE OR REPLACE VIEW public.canvas_snapshot_stats AS
SELECT 
    canvas_id,
    COUNT(*) as total_snapshots,
    COUNT(*) FILTER (WHERE metadata->>'triggerType' = 'manual') as manual_snapshots,
    COUNT(*) FILTER (WHERE metadata->>'triggerType' = 'auto') as auto_snapshots,
    COUNT(*) FILTER (WHERE metadata->>'triggerType' = 'milestone') as milestone_snapshots,
    MIN(created_at) as oldest_snapshot,
    MAX(created_at) as newest_snapshot,
    MAX(version) as latest_version,
    COALESCE(SUM((metadata->'changesSinceLastSnapshot'->>'nodesChanged')::int), 0) as total_node_changes,
    COALESCE(SUM((metadata->'changesSinceLastSnapshot'->>'edgesChanged')::int), 0) as total_edge_changes
FROM public.canvas_snapshots
GROUP BY canvas_id;

-- Grant permissions on the view
GRANT SELECT ON public.canvas_snapshot_stats TO authenticated;

-- Create function to auto-increment version numbers
CREATE OR REPLACE FUNCTION get_next_canvas_version(canvas_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    SELECT COALESCE(MAX(version), 0) + 1 
    INTO next_version
    FROM public.canvas_snapshots 
    WHERE canvas_id = canvas_uuid;
    
    RETURN next_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_next_canvas_version(UUID) TO authenticated;

-- Create function for cleanup
CREATE OR REPLACE FUNCTION cleanup_canvas_snapshots(
    canvas_uuid UUID,
    retention_days INTEGER DEFAULT 90,
    max_auto_snapshots INTEGER DEFAULT 20,
    max_manual_snapshots INTEGER DEFAULT 50
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
    cutoff_date := NOW() - (retention_days || ' days')::INTERVAL;
    
    -- Delete old snapshots (except milestones)
    WITH deleted AS (
        DELETE FROM public.canvas_snapshots
        WHERE canvas_id = canvas_uuid
        AND created_at < cutoff_date
        AND metadata->>'triggerType' != 'milestone'
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    -- Handle excess auto snapshots
    WITH excess_auto AS (
        SELECT id FROM public.canvas_snapshots
        WHERE canvas_id = canvas_uuid
        AND metadata->>'triggerType' = 'auto'
        ORDER BY created_at DESC
        OFFSET max_auto_snapshots
    ),
    deleted_auto AS (
        DELETE FROM public.canvas_snapshots
        WHERE id IN (SELECT id FROM excess_auto)
        RETURNING id
    )
    SELECT deleted_count + COUNT(*) INTO deleted_count FROM deleted_auto;
    
    -- Handle excess manual snapshots
    WITH excess_manual AS (
        SELECT id FROM public.canvas_snapshots
        WHERE canvas_id = canvas_uuid
        AND metadata->>'triggerType' = 'manual'
        ORDER BY created_at DESC
        OFFSET max_manual_snapshots
    ),
    deleted_manual AS (
        DELETE FROM public.canvas_snapshots
        WHERE id IN (SELECT id FROM excess_manual)
        RETURNING id
    )
    SELECT deleted_count + COUNT(*) INTO deleted_count FROM deleted_manual;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on cleanup function
GRANT EXECUTE ON FUNCTION cleanup_canvas_snapshots(UUID, INTEGER, INTEGER, INTEGER) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.canvas_snapshots IS 'Stores canvas snapshots for version history and restore points';
COMMENT ON COLUMN public.canvas_snapshots.canvas_id IS 'Reference to the canvas/project this snapshot belongs to';
COMMENT ON COLUMN public.canvas_snapshots.version IS 'Sequential version number for this canvas';
COMMENT ON COLUMN public.canvas_snapshots.title IS 'User-friendly title for this snapshot';
COMMENT ON COLUMN public.canvas_snapshots.description IS 'Optional description of what changed in this snapshot';
COMMENT ON COLUMN public.canvas_snapshots.nodes IS 'JSON array of all metric cards at the time of snapshot';
COMMENT ON COLUMN public.canvas_snapshots.edges IS 'JSON array of all relationships at the time of snapshot';
COMMENT ON COLUMN public.canvas_snapshots.groups IS 'JSON array of all groups at the time of snapshot';
COMMENT ON COLUMN public.canvas_snapshots.metadata IS 'Additional metadata about the snapshot (trigger type, statistics, etc.)';
COMMENT ON FUNCTION get_next_canvas_version(UUID) IS 'Returns the next version number for a canvas';
COMMENT ON FUNCTION cleanup_canvas_snapshots(UUID, INTEGER, INTEGER, INTEGER) IS 'Cleans up old snapshots based on retention policy';
COMMENT ON VIEW public.canvas_snapshot_stats IS 'Provides aggregated statistics about canvas snapshots';
