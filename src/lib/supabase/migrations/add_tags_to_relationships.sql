-- Add tags column to relationships table
ALTER TABLE relationships 
ADD COLUMN tags TEXT[] DEFAULT NULL;

-- Add comment to describe the column
COMMENT ON COLUMN relationships.tags IS 'Array of tag names associated with this relationship'; 