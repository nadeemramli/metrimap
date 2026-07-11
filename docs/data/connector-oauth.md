# Connector OAuth connect flow (CVS-322)

How a user connects an OAuth source (GA4 first). Server flow:
`src/shared/lib/connectors/oauth/` (SERVER-ONLY); client kickoff:
`src/shared/lib/connectors/connections/oauthClient.ts`; entrypoint:
`supabase/functions/connector-oauth` (deploy with `--no-verify-jwt` — the
provider redirects the browser to `/callback` with no Authorization header).

## Flow

```
app: beginOAuthConnect('ga4')
  → createPendingConnection (RLS insert, status=pending)
  → POST /connector-oauth/start { account_id }        (user JWT; RLS visibility check)
      → signed state (HMAC-SHA256, CONNECTOR_SECRET_KEY, 10-min TTL, CSRF nonce)
      → provider.authUrl → { url }
  → window.location.assign(url)                        (Google consent screen)
Google → GET /connector-oauth/callback?code&state      (public)
  → verifyState (tamper/expiry → error redirect, account untouched)
  → provider.exchange(code) → storeAccountSecret       (AES-GCM; flips to connected)
  → exactly one bindable property? auto-bind it; else the app calls
    POST /connector-oauth/sources → listSources → selectSourceAccount (RLS update)
  → 302 {APP_URL}/?connector_oauth=success|error&account_id&connector
```

Failure at exchange → `markConnectionError` (payload-free) + `auth_failed` audit
row; tokens never reach the browser, logs, or redirect URLs.

## Provider registry (`oauth/providers.ts`)

An `OAuthProvider` supplies `authUrl` / `exchange` / `refresh?` /
`listSourceAccounts?` + the env-var names for its client credentials. Adding
Shopify/Lazada/TikTok/Shopee later = one new entry; the flow, edge function, and
state signing don't change. `ga4` uses Google (scope `analytics.readonly`, which
also covers the Admin API `accountSummaries` read used for the property picker).

## Config

- Function secrets: `CONNECTOR_SECRET_KEY` (signs state + encrypts tokens),
  `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`, `APP_URL`.
- Google OAuth client redirect URI (CVS-280/CVS-321 §1):
  `https://<project-ref>.functions.supabase.co/connector-oauth/callback`
- Deploy: `npx supabase functions deploy connector-oauth --no-verify-jwt`
  (`/start` and `/sources` validate the caller themselves: the JWT must see the
  account under RLS.)

The UI over this (catalog, connect buttons, property picker, status) is CVS-90.
