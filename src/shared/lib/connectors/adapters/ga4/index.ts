// GA4 connector (CVS-146): OAuth 2.0 + a Data API adapter over the CVS-142 runtime.
// The adapter's flat rows feed the CVS-143 GA4 mappers (`ga4:page_metrics`, `ga4:events`).
// See docs/data/connector-ga4.md.
export { createGa4Adapter, type Ga4AdapterOptions } from './adapter';
export {
  buildGoogleAuthUrl,
  exchangeGoogleCode,
  refreshGoogleToken,
  GA4_SCOPE,
  type GoogleTokens,
} from './oauth';
