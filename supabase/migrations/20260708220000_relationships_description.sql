-- Relationship notes persist into relationships.description (CVS-269), but the
-- column never existed remotely — every save with notes failed with
-- "Could not find the 'description' column of 'relationships'", from the
-- RelationshipSheet and the MCP create_relationship tool alike.
alter table public.relationships add column if not exists description text;
