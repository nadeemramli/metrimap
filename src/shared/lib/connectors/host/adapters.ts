// Adapter factory registry (CVS-320). Maps a connector id to a factory that builds its
// CVS-142 ConnectorAdapter from the connected account's metadata. New connectors
// (CVS-147+) register here; the run host stays connector-agnostic.
import { createGa4Adapter } from '../adapters/ga4';
import type { ConnectorAdapter } from '../runtime';

/** The slice of a connected_accounts row a factory needs. */
export interface AdapterAccount {
  id: string;
  connector_id: string;
  source_account_id: string | null;
}

export type AdapterFactory = (account: AdapterAccount, fetchImpl?: typeof fetch) => ConnectorAdapter;

export const ADAPTER_FACTORIES: Record<string, AdapterFactory> = {
  ga4: (account, fetchImpl) => {
    if (!account.source_account_id) {
      throw new Error('GA4 connection has no property id — reconnect the account');
    }
    return createGa4Adapter({ propertyId: account.source_account_id, fetchImpl });
  },
};

/** Build the adapter for a connected account, or throw a readable, payload-free error. */
export function createAdapter(account: AdapterAccount, fetchImpl?: typeof fetch): ConnectorAdapter {
  const factory = ADAPTER_FACTORIES[account.connector_id];
  if (!factory) throw new Error(`no adapter registered for connector '${account.connector_id}'`);
  return factory(account, fetchImpl);
}
