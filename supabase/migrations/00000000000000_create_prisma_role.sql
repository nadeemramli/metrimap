-- Ensure the prisma role exists before applying later grants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'prisma'
  ) THEN
    CREATE ROLE "prisma";
  END IF;
END
$$;


