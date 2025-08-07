[Clerk | Supabase Docs - https://supabase.com/docs/guides/auth/third-party/clerk](https://supabase.com/docs/guides/auth/third-party/clerk)

#

Clerk

##

Use Clerk with your Supabase project

---

Clerk can be used as a third-party authentication provider alongside Supabase Auth, or standalone, with your Supabase project.

## Getting started[#](https://supabase.com/docs/guides/auth/third-party/clerk#getting-started)

Getting started is incredibly easy. Start off by visiting [Clerk's Connect with Supabase page](https://dashboard.clerk.com/setup/supabase) to configure your Clerk instance for Supabase compatibility.

Finally add a [new Third-Party Auth integration with Clerk](https://supabase.com/dashboard/project/_/auth/third-party) in the Supabase dashboard.

### Configure for local development or self-hosting[#](https://supabase.com/docs/guides/auth/third-party/clerk#configure-for-local-development-or-self-hosting)

When developing locally or self-hosting with the Supabase CLI, add the following config to your `supabase/config.toml` file:

    123[auth.third_party.clerk]enabled = truedomain = "example.clerk.accounts.dev"

You will still need to configure your Clerk instance for Supabase compatibility.

### Manually configuring your Clerk instance[#](https://supabase.com/docs/guides/auth/third-party/clerk#manually-configuring-your-clerk-instance)

If you are not able to use [Clerk's Connect with Supabase page](https://dashboard.clerk.com/setup/supabase) to configure your Clerk instance for working with Supabase, follow these steps.

1.  Add the `role` claim to [Clerk session tokens](https://clerk.com/docs/backend-requests/resources/session-tokens) by [customizing them](https://clerk.com/docs/backend-requests/custom-session-token). End-users who are authenticated should have the `authenticated` value for the claim. If you have an advanced Postgres setup where authenticated end-users use different Postgres roles to access the database, adjust the value to use the correct role name.
2.  Once all Clerk session tokens for your instance contain the `role` claim, add a [new Third-Party Auth integration with Clerk](https://supabase.com/dashboard/project/_/auth/third-party) in the Supabase dashboard or register it in the CLI as instructed above.

## Setup the Supabase client library[#](https://supabase.com/docs/guides/auth/third-party/clerk#setup-the-supabase-client-library)

TypeScriptFlutterSwift (iOS)

    123456789const supabaseClient = createClient(    process.env.NEXT_PUBLIC_SUPABASE_URL!,    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,    {      // Session accessed from Clerk SDK, either as Clerk.session (vanilla      // JavaScript) or useSession (React)      accessToken: async () => session?.getToken() ?? null,    }  )

[View source](https://github.com/supabase/supabase/blob/6b172a2ee2830c823e17e6501dc1b5444007fe30/examples/clerk/hooks/useSupabaseClient.ts)

## Using RLS policies[#](https://supabase.com/docs/guides/auth/third-party/clerk#using-rls-policies)

Once you've configured the Supabase client library to use Clerk session tokens, you can use RLS policies to secure access to your project's database, Storage objects and Realtime channels.

The recommended way to design RLS policies with Clerk is to use claims present in your Clerk session token to allow or reject access to your project's data. Check [Clerk's docs](https://clerk.com/docs/backend-requests/resources/session-tokens) on the available JWT claims and their values.

### Example: Check user organization role[#](https://supabase.com/docs/guides/auth/third-party/clerk#example-check-user-organization-role)

    123456789create policy "Only organization admins can insert in table"on secured_tablefor insertto authenticatedwith check (  (((select auth.jwt()->>'org_role') = 'org:admin') or ((select auth.jwt()->'o'->>'rol') = 'admin'))    and  (organization_id = (select coalesce(auth.jwt()->>'org_id', auth.jwt()->'o'->>'id'))));

[View source](https://github.com/supabase/supabase/blob/6b172a2ee2830c823e17e6501dc1b5444007fe30/examples/clerk/supabase/migrations/20250501155648_setup_database.sql)

This RLS policy checks that the newly inserted row in the table has the user's declared organization ID in the `organization_id` column. Additionally it ensures that they're an `org:admin`.

This way only organization admins can add rows to the table, for organizations they're a member of.

### Example: Check user has passed second factor verification[#](https://supabase.com/docs/guides/auth/third-party/clerk#example-check-user-has-passed-second-factor-verification)

    12345678create policy "Only users that have passed second factor verification can read from table"on secured_tableas restrictivefor selectto authenticatedusing (  ((select auth.jwt()->'fva'->>1) != '-1'));

[View source](https://github.com/supabase/supabase/blob/6b172a2ee2830c823e17e6501dc1b5444007fe30/examples/clerk/supabase/migrations/20250501155648_setup_database.sql)

This example uses a restrictive RLS policy checks that the [second factor verification](https://clerk.com/docs/guides/reverification) age element in the `fva` claim is not `'-1'` indicating the user has passed through second factor verification.

## Deprecated integration with JWT templates[#](https://supabase.com/docs/guides/auth/third-party/clerk#deprecated-integration-with-jwt-templates)

As of 1st April 2025 the previously available [Clerk Integration with Supabase](https://supabase.com/partners/integrations/clerk) is considered deprecated and is no longer recommended for use. All projects using the deprecated integration will be excluded from Third-Party Monthly Active User (TP-MAU) charges until at least 1st January 2026.

This integration used low-level primitives that are still available in Supabase and Clerk, such as a [configurable JWT secret](https://supabase.com/dashboard/project/_/settings/api) and [JWT templates from Clerk](https://clerk.com/docs/backend-requests/jwt-templates). This enables you to keep using it in an unofficial manner, though only limited support will be provided from Supabase.

Deprecation is done for the following reasons:

- Sharing your project's JWT secret with a third-party is a problematic security practice
- Rotating the project's JWT secret in this case almost always results in significant downtime for your application
- Additional latency to [generate a new JWT](https://clerk.com/docs/backend-requests/jwt-templates#generate-a-jwt) for use with Supabase, instead of using the Clerk [session tokens](https://clerk.com/docs/backend-requests/resources/session-tokens)
