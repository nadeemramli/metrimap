// Metrimap programmatic API (CVS-98) — RLS-scoped facade over the domain
// services, consumed by the MCP server and reusable in-app.
export { createMetrimapApi, API_VERSION, type MetrimapApi } from './metrimapApi';
export * as apiSchemas from './schemas';
