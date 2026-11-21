-- Run once in the Supabase SQL editor. Safe to re-run.
-- Why: tables made by Prisma in Supabase's "public" schema are reachable through the public REST API with the anon key unless RLS blocks it.
-- Prisma connects as the table owner (postgres), which is NOT affected. The app keeps working.
-- WARNING: if another app uses this same Supabase project through the REST API, do not run the REVOKE lines.
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('public', 'direct2hub') LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.schemaname, r.tablename);
  END LOOP;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
-- Future-proofing: every table created later in "public" (for example by `prisma migrate`) gets RLS switched on automatically, so a forgotten re-run can no longer leave a new table open.
-- If your Supabase role is not allowed to create event triggers this prints a NOTICE and the rest of the script still applies; then just re-run the script after each migration.
CREATE OR REPLACE FUNCTION public.d2h_auto_rls() RETURNS event_trigger LANGUAGE plpgsql AS $fn$
DECLARE obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO') AND object_type IN ('table', 'partitioned table') AND schema_name = 'public' LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY', obj.object_identity);
  END LOOP;
END $fn$;
REVOKE ALL ON FUNCTION public.d2h_auto_rls() FROM PUBLIC, anon, authenticated;
DO $$ BEGIN
  DROP EVENT TRIGGER IF EXISTS d2h_auto_rls;
  CREATE EVENT TRIGGER d2h_auto_rls ON ddl_command_end WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO') EXECUTE FUNCTION public.d2h_auto_rls();
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'Could not create the auto-RLS trigger (no permission). Re-run this script after every migration instead.';
END $$;

-- Self-check. Both queries below must return NO ROWS:
SELECT tablename AS "table still WITHOUT row level security" FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;
SELECT table_name, grantee, privilege_type FROM information_schema.role_table_grants WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated');
-- Also in the Supabase dashboard (Settings > API > "Exposed schemas"): remove "public" if you do not use the REST API yourself. Prisma does not need it.

-- Test afterwards (should return [] or "permission denied", never your data):
--   curl "https://<project>.supabase.co/rest/v1/Product?select=*" -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
