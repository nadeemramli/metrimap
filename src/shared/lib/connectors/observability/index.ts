// Connector observability (CVS-145): payload-free run/audit records + health derivation.
// Records the CVS-142 RunReport (already payload-free) into `connector_runs` and derives
// operator health from recent runs + connection state. See docs/data/connector-observability.md.
export * from './types';
export * from './health';
export {
  safeMessage,
  statusFromReport,
  runRowFromReport,
  recordRun,
  recordConnectionEvent,
  listRuns,
  latestRun,
} from './observability';
