-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tags_project_id ON tags(project_id);
CREATE INDEX IF NOT EXISTS idx_tags_created_by ON tags(created_by);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Add RLS policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policy for users to see tags in projects they have access to
CREATE POLICY "Users can view tags in accessible projects" ON tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = tags.project_id
      AND pc.user_id = auth.uid()
    )
  );

-- Policy for users to create tags in projects they have access to
CREATE POLICY "Users can create tags in accessible projects" ON tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = tags.project_id
      AND pc.user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Policy for users to update tags they created
CREATE POLICY "Users can update tags they created" ON tags
  FOR UPDATE USING (
    created_by = auth.uid()
  );

-- Policy for users to delete tags they created
CREATE POLICY "Users can delete tags they created" ON tags
  FOR DELETE USING (
    created_by = auth.uid()
  );

-- Add comment
COMMENT ON TABLE tags IS 'Project-level tags that can be applied to metrics, relationships, and other entities'; 