// Canonical data layer (CVS-139): the shared contracts both ingestion paths use —
// native connectors (Metrimap fetches → normalizes) and agent push (MCP/API,
// CVS-98–104). Import from here. See docs/data/canonical-schemas.md.
export * from './envelope';
export * from './money';
export * from './schemas';
export * from './registry';
