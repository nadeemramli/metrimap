

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    now(),
    now()
  );
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  UPDATE public.users 
  SET 
    email = new.email,
    name = COALESCE(new.raw_user_meta_data->>'name', new.email),
    updated_at = now()
  WHERE id = new.id;
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_user_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."requesting_user_id"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  )::text;
$$;


ALTER FUNCTION "public"."requesting_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_projects_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_projects_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_user"("user_id" "text", "user_email" "text", "user_name" "text", "user_avatar_url" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO users (id, email, name, avatar_url, updated_at)
  VALUES (user_id, user_email, user_name, user_avatar_url, NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
END;
$$;


ALTER FUNCTION "public"."upsert_user"("user_id" "text", "user_email" "text", "user_name" "text", "user_avatar_url" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."changelog" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "user_id" "text",
    "action" "text" NOT NULL,
    "target" "text" NOT NULL,
    "target_id" "uuid",
    "target_name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "changelog_target_check" CHECK (("target" = ANY (ARRAY['card'::"text", 'relationship'::"text", 'subflow'::"text", 'project'::"text"])))
);


ALTER TABLE "public"."changelog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."evidence_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "relationship_id" "uuid",
    "title" "text" NOT NULL,
    "type" "text" NOT NULL,
    "date" "date" NOT NULL,
    "owner_id" "text",
    "link" "text",
    "hypothesis" "text",
    "summary" "text" NOT NULL,
    "impact_on_confidence" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "text" NOT NULL,
    CONSTRAINT "evidence_items_type_check" CHECK (("type" = ANY (ARRAY['Experiment'::"text", 'Analysis'::"text", 'Notebook'::"text", 'External Research'::"text", 'User Interview'::"text"])))
);


ALTER TABLE "public"."evidence_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "color" "text" DEFAULT '#e5e7eb'::"text",
    "position_x" double precision DEFAULT 0 NOT NULL,
    "position_y" double precision DEFAULT 0 NOT NULL,
    "width" double precision DEFAULT 200 NOT NULL,
    "height" double precision DEFAULT 150 NOT NULL,
    "node_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "text" NOT NULL
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."metric_card_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metric_card_id" "uuid",
    "tag_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."metric_card_tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."metric_card_tags" IS 'Junction table linking metric cards to database tags';



CREATE TABLE IF NOT EXISTS "public"."metric_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "sub_category" "text",
    "position_x" double precision DEFAULT 0 NOT NULL,
    "position_y" double precision DEFAULT 0 NOT NULL,
    "data" "jsonb" DEFAULT '[]'::"jsonb",
    "source_type" "text",
    "formula" "text",
    "causal_factors" "text"[] DEFAULT '{}'::"text"[],
    "dimensions" "text"[] DEFAULT '{}'::"text"[],
    "owner_id" "text",
    "assignees" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "text" NOT NULL,
    CONSTRAINT "metric_cards_category_check" CHECK (("category" = ANY (ARRAY['Core/Value'::"text", 'Data/Metric'::"text", 'Work/Action'::"text", 'Ideas/Hypothesis'::"text", 'Metadata'::"text"]))),
    CONSTRAINT "metric_cards_source_type_check" CHECK (("source_type" = ANY (ARRAY['Manual'::"text", 'Calculated'::"text", 'Random'::"text"])))
);


ALTER TABLE "public"."metric_cards" OWNER TO "postgres";


COMMENT ON TABLE "public"."metric_cards" IS 'Metric cards now use database tags via junction tables';



CREATE TABLE IF NOT EXISTS "public"."project_collaborators" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "user_id" "text",
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "permissions" "text"[] DEFAULT '{read}'::"text"[],
    "invited_at" timestamp with time zone DEFAULT "now"(),
    "joined_at" timestamp with time zone,
    CONSTRAINT "project_collaborators_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text", 'viewer'::"text"])))
);


ALTER TABLE "public"."project_collaborators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "settings" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_modified_by" "text",
    "created_by" "text" NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."relationship_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "relationship_id" "uuid",
    "tag_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."relationship_tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."relationship_tags" IS 'Junction table linking relationships to database tags';



CREATE TABLE IF NOT EXISTS "public"."relationships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "source_id" "uuid",
    "target_id" "uuid",
    "type" "text" NOT NULL,
    "confidence" "text" DEFAULT 'Medium'::"text" NOT NULL,
    "weight" double precision,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "text" NOT NULL,
    CONSTRAINT "relationships_confidence_check" CHECK (("confidence" = ANY (ARRAY['High'::"text", 'Medium'::"text", 'Low'::"text"]))),
    CONSTRAINT "relationships_type_check" CHECK (("type" = ANY (ARRAY['Deterministic'::"text", 'Probabilistic'::"text", 'Causal'::"text", 'Compositional'::"text"]))),
    CONSTRAINT "relationships_weight_check" CHECK ((("weight" >= (0)::double precision) AND ("weight" <= (100)::double precision)))
);


ALTER TABLE "public"."relationships" OWNER TO "postgres";


COMMENT ON TABLE "public"."relationships" IS 'Relationships now use database tags via junction tables';



CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "color" "text",
    "description" "text",
    "project_id" "uuid",
    "created_by" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."tags" IS 'Project-level tags that can be applied to metrics, relationships, and other entities';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."changelog"
    ADD CONSTRAINT "changelog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."evidence_items"
    ADD CONSTRAINT "evidence_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."metric_card_tags"
    ADD CONSTRAINT "metric_card_tags_metric_card_id_tag_id_key" UNIQUE ("metric_card_id", "tag_id");



ALTER TABLE ONLY "public"."metric_card_tags"
    ADD CONSTRAINT "metric_card_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."metric_cards"
    ADD CONSTRAINT "metric_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_collaborators"
    ADD CONSTRAINT "project_collaborators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_collaborators"
    ADD CONSTRAINT "project_collaborators_project_id_user_id_key" UNIQUE ("project_id", "user_id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."relationship_tags"
    ADD CONSTRAINT "relationship_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."relationship_tags"
    ADD CONSTRAINT "relationship_tags_relationship_id_tag_id_key" UNIQUE ("relationship_id", "tag_id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_source_id_target_id_key" UNIQUE ("source_id", "target_id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_changelog_project_id" ON "public"."changelog" USING "btree" ("project_id");



CREATE INDEX "idx_evidence_items_relationship_id" ON "public"."evidence_items" USING "btree" ("relationship_id");



CREATE INDEX "idx_groups_project_id" ON "public"."groups" USING "btree" ("project_id");



CREATE INDEX "idx_metric_card_tags_metric_card_id" ON "public"."metric_card_tags" USING "btree" ("metric_card_id");



CREATE INDEX "idx_metric_card_tags_tag_id" ON "public"."metric_card_tags" USING "btree" ("tag_id");



CREATE INDEX "idx_metric_cards_project_id" ON "public"."metric_cards" USING "btree" ("project_id");



CREATE INDEX "idx_project_collaborators_project_id" ON "public"."project_collaborators" USING "btree" ("project_id");



CREATE INDEX "idx_project_collaborators_user_id" ON "public"."project_collaborators" USING "btree" ("user_id");



CREATE INDEX "idx_projects_created_by" ON "public"."projects" USING "btree" ("created_by");



CREATE INDEX "idx_relationship_tags_relationship_id" ON "public"."relationship_tags" USING "btree" ("relationship_id");



CREATE INDEX "idx_relationship_tags_tag_id" ON "public"."relationship_tags" USING "btree" ("tag_id");



CREATE INDEX "idx_relationships_project_id" ON "public"."relationships" USING "btree" ("project_id");



CREATE INDEX "idx_relationships_source_id" ON "public"."relationships" USING "btree" ("source_id");



CREATE INDEX "idx_relationships_target_id" ON "public"."relationships" USING "btree" ("target_id");



CREATE INDEX "idx_tags_created_by" ON "public"."tags" USING "btree" ("created_by");



CREATE INDEX "idx_tags_name" ON "public"."tags" USING "btree" ("name");



CREATE INDEX "idx_tags_project_id" ON "public"."tags" USING "btree" ("project_id");



CREATE OR REPLACE TRIGGER "update_evidence_items_updated_at" BEFORE UPDATE ON "public"."evidence_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_groups_updated_at" BEFORE UPDATE ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_metric_cards_updated_at" BEFORE UPDATE ON "public"."metric_cards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_projects_updated_at"();



CREATE OR REPLACE TRIGGER "update_relationships_updated_at" BEFORE UPDATE ON "public"."relationships" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."changelog"
    ADD CONSTRAINT "changelog_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."changelog"
    ADD CONSTRAINT "changelog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."evidence_items"
    ADD CONSTRAINT "evidence_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."evidence_items"
    ADD CONSTRAINT "evidence_items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."evidence_items"
    ADD CONSTRAINT "evidence_items_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "public"."relationships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."metric_card_tags"
    ADD CONSTRAINT "metric_card_tags_metric_card_id_fkey" FOREIGN KEY ("metric_card_id") REFERENCES "public"."metric_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."metric_card_tags"
    ADD CONSTRAINT "metric_card_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."metric_cards"
    ADD CONSTRAINT "metric_cards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."metric_cards"
    ADD CONSTRAINT "metric_cards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."metric_cards"
    ADD CONSTRAINT "metric_cards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_collaborators"
    ADD CONSTRAINT "project_collaborators_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_collaborators"
    ADD CONSTRAINT "project_collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."relationship_tags"
    ADD CONSTRAINT "relationship_tags_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "public"."relationships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."relationship_tags"
    ADD CONSTRAINT "relationship_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."metric_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."relationships"
    ADD CONSTRAINT "relationships_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "public"."metric_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



CREATE POLICY "Project owners can add collaborators" ON "public"."project_collaborators" FOR INSERT WITH CHECK (true);



CREATE POLICY "Project owners can delete changelog entries" ON "public"."changelog" FOR DELETE USING (true);



CREATE POLICY "Project owners can remove collaborators" ON "public"."project_collaborators" FOR DELETE USING (true);



CREATE POLICY "Project owners can update changelog entries" ON "public"."changelog" FOR UPDATE USING (true);



CREATE POLICY "Project owners can update collaborators" ON "public"."project_collaborators" FOR UPDATE USING (true);



CREATE POLICY "Users can create changelog entries in accessible projects" ON "public"."changelog" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create evidence items in accessible projects" ON "public"."evidence_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create groups in accessible projects" ON "public"."groups" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create metric card tags in accessible projects" ON "public"."metric_card_tags" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create metric cards in accessible projects" ON "public"."metric_cards" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create projects" ON "public"."projects" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create relationship tags in accessible projects" ON "public"."relationship_tags" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create relationships in accessible projects" ON "public"."relationships" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create tags in accessible projects" ON "public"."tags" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can delete evidence items in accessible projects" ON "public"."evidence_items" FOR DELETE USING (true);



CREATE POLICY "Users can delete groups in accessible projects" ON "public"."groups" FOR DELETE USING (true);



CREATE POLICY "Users can delete metric card tags in accessible projects" ON "public"."metric_card_tags" FOR DELETE USING (true);



CREATE POLICY "Users can delete metric cards in accessible projects" ON "public"."metric_cards" FOR DELETE USING (true);



CREATE POLICY "Users can delete own projects" ON "public"."projects" FOR DELETE USING (true);



CREATE POLICY "Users can delete relationship tags in accessible projects" ON "public"."relationship_tags" FOR DELETE USING (true);



CREATE POLICY "Users can delete relationships in accessible projects" ON "public"."relationships" FOR DELETE USING (true);



CREATE POLICY "Users can delete tags they created" ON "public"."tags" FOR DELETE USING (true);



CREATE POLICY "Users can insert own profile" ON "public"."users" FOR INSERT WITH CHECK (("public"."requesting_user_id"() = "id"));



CREATE POLICY "Users can insert own projects" ON "public"."projects" FOR INSERT WITH CHECK (("public"."requesting_user_id"() = "created_by"));



CREATE POLICY "Users can update evidence items in accessible projects" ON "public"."evidence_items" FOR UPDATE USING (true);



CREATE POLICY "Users can update groups in accessible projects" ON "public"."groups" FOR UPDATE USING (true);



CREATE POLICY "Users can update metric cards in accessible projects" ON "public"."metric_cards" FOR UPDATE USING (true);



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING (("public"."requesting_user_id"() = "id"));



CREATE POLICY "Users can update own projects" ON "public"."projects" FOR UPDATE USING (("public"."requesting_user_id"() = "created_by"));



CREATE POLICY "Users can update own projects only" ON "public"."projects" FOR UPDATE USING (true);



CREATE POLICY "Users can update relationships in accessible projects" ON "public"."relationships" FOR UPDATE USING (true);



CREATE POLICY "Users can update tags they created" ON "public"."tags" FOR UPDATE USING (true);



CREATE POLICY "Users can view changelog in accessible projects" ON "public"."changelog" FOR SELECT USING (true);



CREATE POLICY "Users can view collaborators of accessible projects" ON "public"."project_collaborators" FOR SELECT USING (true);



CREATE POLICY "Users can view evidence items in accessible projects" ON "public"."evidence_items" FOR SELECT USING (true);



CREATE POLICY "Users can view groups in accessible projects" ON "public"."groups" FOR SELECT USING (true);



CREATE POLICY "Users can view metric card tags in accessible projects" ON "public"."metric_card_tags" FOR SELECT USING (true);



CREATE POLICY "Users can view metric cards in accessible projects" ON "public"."metric_cards" FOR SELECT USING (true);



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING (("public"."requesting_user_id"() = "id"));



CREATE POLICY "Users can view own projects" ON "public"."projects" FOR SELECT USING (("public"."requesting_user_id"() = "created_by"));



CREATE POLICY "Users can view own projects only" ON "public"."projects" FOR SELECT USING (true);



CREATE POLICY "Users can view relationship tags in accessible projects" ON "public"."relationship_tags" FOR SELECT USING (true);



CREATE POLICY "Users can view relationships in accessible projects" ON "public"."relationships" FOR SELECT USING (true);



CREATE POLICY "Users can view tags in accessible projects" ON "public"."tags" FOR SELECT USING (true);



ALTER TABLE "public"."changelog" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."evidence_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."metric_card_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."metric_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_collaborators" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."relationship_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."relationships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_projects_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_projects_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_projects_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_user"("user_id" "text", "user_email" "text", "user_name" "text", "user_avatar_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_user"("user_id" "text", "user_email" "text", "user_name" "text", "user_avatar_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_user"("user_id" "text", "user_email" "text", "user_name" "text", "user_avatar_url" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."changelog" TO "anon";
GRANT ALL ON TABLE "public"."changelog" TO "authenticated";
GRANT ALL ON TABLE "public"."changelog" TO "service_role";



GRANT ALL ON TABLE "public"."evidence_items" TO "anon";
GRANT ALL ON TABLE "public"."evidence_items" TO "authenticated";
GRANT ALL ON TABLE "public"."evidence_items" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."metric_card_tags" TO "anon";
GRANT ALL ON TABLE "public"."metric_card_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."metric_card_tags" TO "service_role";



GRANT ALL ON TABLE "public"."metric_cards" TO "anon";
GRANT ALL ON TABLE "public"."metric_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."metric_cards" TO "service_role";



GRANT ALL ON TABLE "public"."project_collaborators" TO "anon";
GRANT ALL ON TABLE "public"."project_collaborators" TO "authenticated";
GRANT ALL ON TABLE "public"."project_collaborators" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."relationship_tags" TO "anon";
GRANT ALL ON TABLE "public"."relationship_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."relationship_tags" TO "service_role";



GRANT ALL ON TABLE "public"."relationships" TO "anon";
GRANT ALL ON TABLE "public"."relationships" TO "authenticated";
GRANT ALL ON TABLE "public"."relationships" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
