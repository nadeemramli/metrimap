-- Create canvas_nodes table for storing all types of canvas nodes
-- This includes comment nodes, source nodes, chart nodes, operator nodes, etc.

CREATE TABLE IF NOT EXISTS public.canvas_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Node type and data
    node_type TEXT NOT NULL CHECK (node_type IN ('commentNode', 'sourceNode', 'chartNode', 'operatorNode', 'whiteboardNode')),
    title TEXT,
    
    -- Position on canvas
    position_x DOUBLE PRECISION DEFAULT 0 NOT NULL,
    position_y DOUBLE PRECISION DEFAULT 0 NOT NULL,
    
    -- Node-specific data stored as JSONB
    data JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by TEXT NOT NULL
);

-- Add RLS policies
ALTER TABLE public.canvas_nodes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view canvas nodes in projects they have access to
CREATE POLICY "Users can view canvas nodes in accessible projects" ON public.canvas_nodes
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.created_by = auth.uid()::text
               OR pc.user_id = auth.uid()::text
               OR p.is_public = true
        )
    );

-- Policy: Users can insert canvas nodes in projects they have access to
CREATE POLICY "Users can insert canvas nodes in accessible projects" ON public.canvas_nodes
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT p.id FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.created_by = auth.uid()::text
               OR pc.user_id = auth.uid()::text
        )
    );

-- Policy: Users can update canvas nodes in projects they have access to
CREATE POLICY "Users can update canvas nodes in accessible projects" ON public.canvas_nodes
    FOR UPDATE USING (
        project_id IN (
            SELECT p.id FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.created_by = auth.uid()::text
               OR pc.user_id = auth.uid()::text
        )
    );

-- Policy: Users can delete canvas nodes in projects they have access to
CREATE POLICY "Users can delete canvas nodes in accessible projects" ON public.canvas_nodes
    FOR DELETE USING (
        project_id IN (
            SELECT p.id FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.created_by = auth.uid()::text
               OR pc.user_id = auth.uid()::text
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_project_id ON public.canvas_nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_node_type ON public.canvas_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_created_at ON public.canvas_nodes(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_canvas_nodes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_canvas_nodes_updated_at
    BEFORE UPDATE ON public.canvas_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_canvas_nodes_updated_at();
