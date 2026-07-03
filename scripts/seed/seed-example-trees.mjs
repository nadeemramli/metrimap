#!/usr/bin/env node
/**
 * Seed 3 comprehensive example metric trees (SaaS, E-commerce, Retail walk-in)
 * into the cloud Supabase project. Inserts via the SERVICE ROLE key (bypasses
 * RLS) and also writes a reusable SQL file at scripts/seed/example-metric-trees.sql.
 *
 * Usage:  node scripts/seed/seed-example-trees.mjs
 * Env (read from .env): VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Owner: set OWNER below (a Clerk user id that exists in public.users).
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// --- env ---
function readEnv(name) {
  const env = readFileSync(resolve(ROOT, '.env'), 'utf8');
  const m = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return m ? m[1].trim() : undefined;
}
const SUPABASE_URL = readEnv('VITE_SUPABASE_URL');
const SERVICE_KEY = readEnv('SUPABASE_SERVICE_ROLE_KEY');
const OWNER = 'user_30uQARGezqSApAChPSGSwFyUy85'; // demo account
const IS_PUBLIC = true;

// --- helpers to declare trees compactly ---
const N = (key, title, cat, desc = '') => ({ key, title, cat, desc });
const E = (from, to, type = 'Compositional', w = 85, conf = 'High') => ({
  from,
  to,
  type,
  w,
  conf,
});
const VAL = 'Core/Value';
const MET = 'Data/Metric';
const ACT = 'Work/Action';
const HYP = 'Ideas/Hypothesis';

// --- sample time-series values (last 7 months) for quantitative cards ---
const rand = (min, max) => min + Math.random() * (max - min);
const round = (v, d = 0) => {
  const p = 10 ** d;
  return Math.round(v * p) / p;
};
function monthsBack(n) {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}
function baseValueFor(title) {
  const t = title.toLowerCase();
  if (/(rate|%|conversion|churn|margin|retention|capture|abandon|open|ratio|nrr|nps)/.test(t))
    return rand(2, 65); // percentage
  if (/(revenue|profit|mrr|arr|arpa|cac|ltv|cost|spend|aov|basket|price|cogs|rent|wage|fees|payback|value)/.test(t))
    return rand(2000, 800000); // currency
  if (/(traffic|sessions|visitors|leads|orders|customers|foot|transactions|reach|followers|passersby|items|list|members|trials|seats)/.test(t))
    return rand(400, 90000); // counts
  return rand(40, 5000);
}
function makeSeries(title) {
  const periods = monthsBack(7);
  const down = /(churn|abandon|cost|cac|cogs|shrink|returns|queue|contraction)/.test(
    title.toLowerCase()
  );
  const drift = (down ? -1 : 1) * rand(0.02, 0.08);
  let v = baseValueFor(title);
  let prev = null;
  return periods.map((period, i) => {
    if (i > 0) v = Math.max(0.1, v * (1 + drift + rand(-0.025, 0.025)));
    const value = round(v, v < 100 ? 1 : 0);
    const change_percent =
      prev == null || prev === 0 ? 0 : round(((value - prev) / prev) * 100, 1);
    const trend = change_percent > 1 ? 'up' : change_percent < -1 ? 'down' : 'neutral';
    prev = value;
    return { period, value, change_percent, trend };
  });
}
const isQuantitative = (cat) => cat === MET || cat === VAL;

// --- workflow enrichment (Strategy board) ---
// Deterministic cycles so every kanban column, priority and confidence tier is
// exercised; statuses must be the canonical snake_case values (CHECK constraint).
const ACT_STATUS_CYCLE = ['in_progress', 'planning', 'backlog', 'done', 'on_hold'];
const HYP_STATUS_CYCLE = ['backlog', 'planning', 'in_progress'];
const PRIORITY_CYCLE = ['High', 'Medium', 'Low'];
const ACTION_SUBCATS = ['Experiment', 'Initiative', 'BAU'];
const EVIDENCE_TYPES = ['Experiment', 'Analysis', 'External Research'];
function isoDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function guessUnit(title) {
  const t = title.toLowerCase();
  if (/(rate|%|conversion|churn|margin|retention|nrr)/.test(t)) return '%';
  if (/(revenue|profit|mrr|arr|arpa|cac|ltv|aov|basket|spend|value)/.test(t)) return 'USD';
  return null;
}

// ===================== SaaS =====================
const saas = {
  name: 'SaaS — Example Metric Tree',
  description:
    'Decomposition of profit for a B2B SaaS: ARR/MRR movements, acquisition funnel, channels (incl. social), unit economics, and cost structure.',
  nodes: [
    N('profit', 'Profit', VAL, 'Revenue − Total Costs'),
    N('revenue', 'Revenue (ARR)', MET, 'MRR × 12'),
    N('mrr', 'MRR', MET, 'Monthly Recurring Revenue'),
    N('newmrr', 'New MRR', MET, 'New Customers × ARPA'),
    N('expmrr', 'Expansion MRR', MET, 'Upsell + cross-sell'),
    N('reactmrr', 'Reactivation MRR', MET),
    N('churnmrr', 'Churned MRR', MET, 'Lost recurring revenue'),
    N('contractmrr', 'Contraction MRR', MET, 'Downgrades'),
    N('newcust', 'New Customers', MET, 'Trials × Trial→Paid'),
    N('arpa', 'ARPA', MET, 'Avg revenue per account'),
    N('price', 'Avg Price', MET),
    N('seats', 'Avg Seats / Account', MET),
    N('trials', 'Trials Started', MET, 'MQLs × Lead→Trial'),
    N('trialconv', 'Trial→Paid Conversion %', MET),
    N('mql', 'Marketing Qualified Leads', MET, 'Visitors × Visitor→Lead'),
    N('v2l', 'Visitor→Lead %', MET),
    N('visitors', 'Website Visitors', MET, 'Sum of channels'),
    N('organic', 'Organic / SEO Traffic', MET),
    N('paid', 'Paid Search Traffic', MET, 'Ad Spend / CPC'),
    N('social', 'Social Media Traffic', MET, 'Reach × CTR'),
    N('referral', 'Referral Traffic', MET),
    N('direct', 'Direct Traffic', MET),
    N('emailt', 'Email Traffic', MET),
    N('reach', 'Social Reach / Followers', MET),
    N('engage', 'Social Engagement Rate', MET),
    N('posts', 'Content Cadence (posts/wk)', MET),
    N('adspend', 'Ad Spend', MET),
    N('cpc', 'CPC', MET),
    N('churnrate', 'Customer Churn Rate', MET),
    N('nrr', 'Net Revenue Retention', MET),
    N('cac', 'CAC', MET, 'S&M / New Customers'),
    N('ltv', 'LTV', MET, 'ARPA × GM% / churn'),
    N('ltvcac', 'LTV : CAC', MET),
    N('payback', 'CAC Payback (months)', MET),
    N('gm', 'Gross Margin %', MET),
    N('costs', 'Total Costs', MET, 'COGS + S&M + R&D + G&A'),
    N('cogs', 'COGS', MET, 'Hosting + Support'),
    N('hosting', 'Hosting / Infra', MET),
    N('support', 'Support Cost', MET),
    N('sm', 'Sales & Marketing', MET),
    N('rnd', 'R&D', MET),
    N('gna', 'G&A', MET),
    N('lever_seo', 'Launch content/SEO program', ACT),
    N('lever_onboard', 'Improve onboarding flow', ACT),
    N('lever_cs', 'Customer success program', ACT),
    N('lever_ref', 'Referral program', ACT),
    N('hyp_annual', 'Annual billing reduces churn', HYP),
    N('hyp_selfserve', 'Self-serve trial lifts conversion', HYP),
  ],
  edges: [
    E('revenue', 'profit', 'Compositional', 95),
    E('costs', 'profit', 'Compositional', 90),
    E('gm', 'profit', 'Causal', 70),
    E('mrr', 'revenue', 'Deterministic', 95),
    E('newmrr', 'mrr', 'Compositional', 80),
    E('expmrr', 'mrr', 'Compositional', 70),
    E('reactmrr', 'mrr', 'Compositional', 40),
    E('churnmrr', 'mrr', 'Compositional', 75),
    E('contractmrr', 'mrr', 'Compositional', 50),
    E('newcust', 'newmrr', 'Deterministic', 90),
    E('arpa', 'newmrr', 'Deterministic', 80),
    E('price', 'arpa', 'Deterministic', 80),
    E('seats', 'arpa', 'Deterministic', 70),
    E('trials', 'newcust', 'Deterministic', 85),
    E('trialconv', 'newcust', 'Probabilistic', 80),
    E('mql', 'trials', 'Deterministic', 80),
    E('v2l', 'trials', 'Probabilistic', 70),
    E('visitors', 'mql', 'Deterministic', 85),
    E('organic', 'visitors', 'Compositional', 70),
    E('paid', 'visitors', 'Compositional', 65),
    E('social', 'visitors', 'Compositional', 55),
    E('referral', 'visitors', 'Compositional', 45),
    E('direct', 'visitors', 'Compositional', 50),
    E('emailt', 'visitors', 'Compositional', 50),
    E('reach', 'social', 'Causal', 70),
    E('engage', 'social', 'Causal', 60),
    E('posts', 'reach', 'Causal', 55),
    E('adspend', 'paid', 'Deterministic', 80),
    E('cpc', 'paid', 'Deterministic', 70),
    E('churnrate', 'churnmrr', 'Causal', 85),
    E('churnrate', 'nrr', 'Causal', 70),
    E('sm', 'cac', 'Deterministic', 85),
    E('newcust', 'cac', 'Deterministic', 80),
    E('arpa', 'ltv', 'Deterministic', 75),
    E('churnrate', 'ltv', 'Causal', 80),
    E('ltv', 'ltvcac', 'Deterministic', 80),
    E('cac', 'ltvcac', 'Deterministic', 80),
    E('cac', 'payback', 'Deterministic', 70),
    E('cogs', 'costs', 'Compositional', 80),
    E('sm', 'costs', 'Compositional', 80),
    E('rnd', 'costs', 'Compositional', 70),
    E('gna', 'costs', 'Compositional', 60),
    E('hosting', 'cogs', 'Compositional', 70),
    E('support', 'cogs', 'Compositional', 60),
    E('cogs', 'gm', 'Causal', 70),
    E('adspend', 'sm', 'Compositional', 70),
    E('lever_seo', 'organic', 'Causal', 70),
    E('lever_onboard', 'trialconv', 'Causal', 75),
    E('lever_cs', 'churnrate', 'Causal', 70),
    E('lever_ref', 'referral', 'Causal', 70),
    E('hyp_annual', 'churnrate', 'Probabilistic', 50),
    E('hyp_selfserve', 'trialconv', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Acquisition Funnel', keys: ['visitors','organic','paid','social','referral','direct','emailt','reach','engage','posts','adspend','cpc','mql','v2l','trials','trialconv','newcust'] },
    { name: 'Revenue & MRR', keys: ['revenue','mrr','newmrr','expmrr','reactmrr','churnmrr','contractmrr','arpa','price','seats'] },
    { name: 'Unit Economics', keys: ['cac','ltv','ltvcac','payback','churnrate','nrr'] },
    { name: 'Cost Structure', keys: ['costs','cogs','hosting','support','sm','rnd','gna','gm'] },
  ],
  journey: [
    { key: 'j_acquire', title: 'Acquire', desc: 'Traffic → leads → trials', links: ['visitors','mql'], work: ['lever_seo'] },
    { key: 'j_activate', title: 'Activate', desc: 'Trials become paying customers', links: ['trials','trialconv'], work: ['lever_onboard','hyp_selfserve'] },
    { key: 'j_retain', title: 'Retain & Expand', desc: 'Keep and grow accounts', links: ['churnrate','nrr','expmrr'], work: ['lever_cs','hyp_annual'] },
  ],
};

// ===================== E-commerce =====================
const ecom = {
  name: 'E-commerce — Example Metric Tree',
  description:
    'Decomposition of profit for an online store: orders = sessions × conversion, AOV, channel mix (incl. social/email), retention, and cost structure.',
  nodes: [
    N('profit', 'Profit', VAL, 'Revenue − Total Costs'),
    N('revenue', 'Revenue', MET, 'Orders × AOV'),
    N('orders', 'Orders', MET, 'Sessions × Conversion'),
    N('aov', 'Average Order Value', MET, 'Items × Avg item price'),
    N('sessions', 'Sessions', MET, 'Sum of channels'),
    N('cvr', 'Conversion Rate', MET),
    N('items', 'Items per Order', MET),
    N('itemprice', 'Avg Item Price', MET),
    N('crosssell', 'Cross-sell Rate', MET),
    N('upsell', 'Upsell Rate', MET),
    N('organic', 'Organic Sessions', MET),
    N('paid', 'Paid Sessions', MET, 'Ad Spend / CPC'),
    N('social', 'Social Sessions', MET, 'Reach × CTR'),
    N('email', 'Email Sessions', MET, 'List × Open × CTR'),
    N('direct', 'Direct Sessions', MET),
    N('affiliate', 'Affiliate Sessions', MET),
    N('reach', 'Social Reach / Followers', MET),
    N('ctr', 'Social CTR', MET),
    N('posts', 'Content Cadence', MET),
    N('list', 'Email List Size', MET),
    N('openrate', 'Email Open Rate', MET),
    N('adspend', 'Ad Spend', MET),
    N('cpc', 'CPC', MET),
    N('pdpcvr', 'Product Page CVR', MET),
    N('atc', 'Add-to-Cart Rate', MET),
    N('cartabandon', 'Cart Abandonment Rate', MET),
    N('checkoutcvr', 'Checkout Completion %', MET),
    N('newcust', 'New Customers', MET),
    N('repeat', 'Repeat Purchase Rate', MET),
    N('freq', 'Purchase Frequency', MET),
    N('ltv', 'Customer LTV', MET),
    N('cac', 'CAC', MET),
    N('costs', 'Total Costs', MET),
    N('cogs', 'COGS', MET),
    N('gm', 'Gross Margin %', MET),
    N('shipping', 'Shipping Cost', MET),
    N('returns', 'Returns Rate', MET),
    N('marketing', 'Marketing Spend', MET),
    N('payfees', 'Payment Fees', MET),
    N('fulfil', 'Fulfilment / Ops', MET),
    N('lever_retarget', 'Retargeting campaign', ACT),
    N('lever_email', 'Abandoned-cart email flow', ACT),
    N('lever_bundle', 'Product bundles', ACT),
    N('lever_ugc', 'UGC / influencer social', ACT),
    N('hyp_freeship', 'Free-ship threshold lifts AOV', HYP),
    N('hyp_reviews', 'Reviews lift product-page CVR', HYP),
  ],
  edges: [
    E('revenue', 'profit', 'Compositional', 95),
    E('costs', 'profit', 'Compositional', 90),
    E('gm', 'profit', 'Causal', 70),
    E('orders', 'revenue', 'Deterministic', 95),
    E('aov', 'revenue', 'Deterministic', 90),
    E('sessions', 'orders', 'Deterministic', 90),
    E('cvr', 'orders', 'Probabilistic', 85),
    E('items', 'aov', 'Deterministic', 80),
    E('itemprice', 'aov', 'Deterministic', 75),
    E('crosssell', 'aov', 'Causal', 60),
    E('upsell', 'aov', 'Causal', 60),
    E('organic', 'sessions', 'Compositional', 70),
    E('paid', 'sessions', 'Compositional', 70),
    E('social', 'sessions', 'Compositional', 60),
    E('email', 'sessions', 'Compositional', 60),
    E('direct', 'sessions', 'Compositional', 50),
    E('affiliate', 'sessions', 'Compositional', 45),
    E('reach', 'social', 'Causal', 70),
    E('ctr', 'social', 'Causal', 65),
    E('posts', 'reach', 'Causal', 55),
    E('list', 'email', 'Deterministic', 70),
    E('openrate', 'email', 'Probabilistic', 65),
    E('adspend', 'paid', 'Deterministic', 80),
    E('cpc', 'paid', 'Deterministic', 70),
    E('pdpcvr', 'cvr', 'Causal', 75),
    E('atc', 'cvr', 'Causal', 75),
    E('cartabandon', 'checkoutcvr', 'Causal', 80),
    E('checkoutcvr', 'cvr', 'Deterministic', 80),
    E('newcust', 'orders', 'Causal', 55),
    E('repeat', 'freq', 'Causal', 70),
    E('freq', 'ltv', 'Deterministic', 75),
    E('aov', 'ltv', 'Causal', 60),
    E('marketing', 'cac', 'Deterministic', 80),
    E('newcust', 'cac', 'Deterministic', 75),
    E('cogs', 'costs', 'Compositional', 80),
    E('shipping', 'costs', 'Compositional', 65),
    E('marketing', 'costs', 'Compositional', 70),
    E('returns', 'costs', 'Causal', 60),
    E('payfees', 'costs', 'Compositional', 50),
    E('fulfil', 'costs', 'Compositional', 60),
    E('cogs', 'gm', 'Causal', 75),
    E('adspend', 'marketing', 'Compositional', 70),
    E('lever_retarget', 'paid', 'Causal', 60),
    E('lever_email', 'cartabandon', 'Causal', 70),
    E('lever_bundle', 'aov', 'Causal', 65),
    E('lever_ugc', 'reach', 'Causal', 60),
    E('hyp_freeship', 'aov', 'Probabilistic', 50),
    E('hyp_reviews', 'pdpcvr', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Traffic & Channels', keys: ['sessions','organic','paid','social','email','direct','affiliate','reach','ctr','posts','list','openrate','adspend','cpc'] },
    { name: 'Conversion & Orders', keys: ['orders','cvr','pdpcvr','atc','cartabandon','checkoutcvr','newcust'] },
    { name: 'AOV & Retention', keys: ['aov','items','itemprice','crosssell','upsell','repeat','freq','ltv'] },
    { name: 'Cost Structure', keys: ['costs','cogs','gm','shipping','returns','marketing','payfees','fulfil','cac'] },
  ],
  journey: [
    { key: 'j_discover', title: 'Discover', desc: 'Shoppers find the store', links: ['sessions','reach'], work: ['lever_ugc'] },
    { key: 'j_purchase', title: 'Purchase', desc: 'Visit converts to an order', links: ['cvr','checkoutcvr'], work: ['lever_email','hyp_reviews'] },
    { key: 'j_repeat', title: 'Repeat & Grow', desc: 'Customers come back for more', links: ['repeat','ltv'], work: ['lever_bundle','hyp_freeship'] },
  ],
};

// ===================== Retail (walk-in) =====================
const retail = {
  name: 'Retail (Walk-in) — Example Metric Tree',
  description:
    'Decomposition of profit for a physical store: transactions = foot traffic × conversion, basket size, footfall drivers (incl. local social), and store cost structure.',
  nodes: [
    N('profit', 'Profit', VAL, 'Revenue − Total Costs'),
    N('revenue', 'Revenue', MET, 'Transactions × Avg Basket'),
    N('txn', 'Transactions', MET, 'Foot traffic × Conversion'),
    N('basket', 'Average Basket Value', MET, 'Items × Avg item price'),
    N('foot', 'Foot Traffic', MET, 'Passersby × Capture rate'),
    N('cvr', 'Walk-in Conversion %', MET),
    N('items', 'Items per Basket', MET),
    N('itemprice', 'Avg Item Price', MET),
    N('impulse', 'Impulse / POS add-ons', MET),
    N('passersby', 'Passersby (location footfall)', MET),
    N('capture', 'Capture Rate', MET, 'Share who enter'),
    N('window', 'Window Display Score', MET),
    N('signage', 'Signage / Promo Visibility', MET),
    N('localmkt', 'Local Marketing Reach', MET),
    N('socialloc', 'Local Social Awareness', MET, 'Reach × engagement'),
    N('reach', 'Social Reach / Followers', MET),
    N('engage', 'Social Engagement', MET),
    N('events', 'In-store Events / Promos', MET),
    N('season', 'Seasonality / Weather', MET),
    N('staffratio', 'Staff : Customer Ratio', MET),
    N('availability', 'Product Availability %', MET),
    N('queue', 'Avg Queue Time', MET),
    N('loyalty', 'Loyalty Members', MET),
    N('repeat', 'Repeat Visit Rate', MET),
    N('nps', 'Customer Satisfaction (NPS)', MET),
    N('costs', 'Total Costs', MET),
    N('cogs', 'COGS', MET),
    N('gm', 'Gross Margin %', MET),
    N('rent', 'Rent', MET),
    N('labor', 'Labor Cost', MET),
    N('staffhours', 'Staff Hours', MET),
    N('wage', 'Avg Wage', MET),
    N('utilities', 'Utilities', MET),
    N('shrink', 'Shrinkage (loss/theft)', MET),
    N('marketing', 'Marketing Spend', MET),
    N('lever_train', 'Staff sales training', ACT),
    N('lever_loyalty', 'Loyalty program', ACT),
    N('lever_window', 'Refresh window display', ACT),
    N('lever_social', 'Local social campaign', ACT),
    N('lever_layout', 'Optimize store layout', ACT),
    N('hyp_events', 'Weekend events lift foot traffic', HYP),
    N('hyp_staff', 'More staff lifts conversion', HYP),
  ],
  edges: [
    E('revenue', 'profit', 'Compositional', 95),
    E('costs', 'profit', 'Compositional', 90),
    E('gm', 'profit', 'Causal', 70),
    E('txn', 'revenue', 'Deterministic', 95),
    E('basket', 'revenue', 'Deterministic', 90),
    E('foot', 'txn', 'Deterministic', 90),
    E('cvr', 'txn', 'Probabilistic', 85),
    E('items', 'basket', 'Deterministic', 80),
    E('itemprice', 'basket', 'Deterministic', 75),
    E('impulse', 'basket', 'Causal', 55),
    E('passersby', 'foot', 'Deterministic', 80),
    E('capture', 'foot', 'Probabilistic', 75),
    E('window', 'capture', 'Causal', 70),
    E('signage', 'capture', 'Causal', 60),
    E('localmkt', 'passersby', 'Causal', 55),
    E('socialloc', 'passersby', 'Causal', 50),
    E('reach', 'socialloc', 'Causal', 65),
    E('engage', 'socialloc', 'Causal', 55),
    E('events', 'foot', 'Causal', 60),
    E('season', 'passersby', 'Causal', 50),
    E('staffratio', 'cvr', 'Causal', 70),
    E('availability', 'cvr', 'Causal', 70),
    E('queue', 'cvr', 'Causal', 60),
    E('loyalty', 'repeat', 'Causal', 70),
    E('repeat', 'foot', 'Causal', 55),
    E('nps', 'repeat', 'Causal', 60),
    E('cogs', 'costs', 'Compositional', 80),
    E('rent', 'costs', 'Compositional', 70),
    E('labor', 'costs', 'Compositional', 75),
    E('staffhours', 'labor', 'Deterministic', 80),
    E('wage', 'labor', 'Deterministic', 70),
    E('utilities', 'costs', 'Compositional', 50),
    E('shrink', 'costs', 'Causal', 55),
    E('marketing', 'costs', 'Compositional', 60),
    E('cogs', 'gm', 'Causal', 75),
    E('staffhours', 'staffratio', 'Causal', 60),
    E('localmkt', 'marketing', 'Compositional', 60),
    E('lever_train', 'cvr', 'Causal', 70),
    E('lever_loyalty', 'loyalty', 'Causal', 75),
    E('lever_window', 'window', 'Causal', 75),
    E('lever_social', 'reach', 'Causal', 65),
    E('lever_layout', 'impulse', 'Causal', 55),
    E('hyp_events', 'events', 'Probabilistic', 50),
    E('hyp_staff', 'staffratio', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Foot Traffic', keys: ['foot','passersby','capture','window','signage','localmkt','socialloc','reach','engage','events','season'] },
    { name: 'Conversion & Basket', keys: ['txn','cvr','staffratio','availability','queue','basket','items','itemprice','impulse'] },
    { name: 'Retention', keys: ['loyalty','repeat','nps'] },
    { name: 'Cost Structure', keys: ['costs','cogs','gm','rent','labor','staffhours','wage','utilities','shrink','marketing'] },
  ],
  journey: [
    { key: 'j_attract', title: 'Attract', desc: 'Passersby walk into the store', links: ['passersby','capture'], work: ['lever_window','hyp_events'] },
    { key: 'j_convert', title: 'Convert', desc: 'Visits become transactions', links: ['cvr','basket'], work: ['lever_train','hyp_staff'] },
    { key: 'j_return', title: 'Return', desc: 'Customers come back', links: ['loyalty','repeat'], work: ['lever_loyalty'] },
  ],
};

// ===================== Web Analytics (GA4-style) =====================
const web = {
  name: 'Web Analytics — Example Metric Tree',
  description:
    'GA4-style acquisition → engagement → conversion tree: sessions by channel drive engaged sessions, conversions, and revenue.',
  root: 'convvalue',
  nodes: [
    N('convvalue', 'Conversion Value', VAL, 'Conversions × Value per Conversion'),
    N('conversions', 'Conversions', MET, 'Key events (purchase/signup)'),
    N('cvr', 'Conversion Rate', MET, 'Conversions ÷ Sessions'),
    N('vpc', 'Value per Conversion', MET, 'Avg revenue per conversion'),
    N('sessions', 'Sessions', MET, 'Total sessions'),
    N('users', 'Users', MET, 'Unique users'),
    N('spu', 'Sessions per User', MET, 'Sessions ÷ Users'),
    N('organic', 'Organic Search', MET, 'SEO sessions'),
    N('paid', 'Paid Search', MET, 'SEM sessions'),
    N('social', 'Social', MET, 'Social sessions'),
    N('direct', 'Direct', MET, 'Direct sessions'),
    N('referral', 'Referral', MET, 'Referral sessions'),
    N('engaged', 'Engaged Sessions', MET, 'Sessions > 10s / 2 pageviews'),
    N('engrate', 'Engagement Rate', MET, 'Engaged ÷ Sessions'),
    N('avgdur', 'Avg Engagement Time', MET, 'Seconds per session'),
    N('bounce', 'Bounce Rate', MET, 'Non-engaged share'),
    N('ppp', 'Pages per Session', MET, 'Pageviews ÷ Sessions'),
    N('newret', 'New vs Returning', MET, 'Returning user share'),
    N('lever_seo', 'SEO Content Program', ACT, 'Publish + optimize landing pages'),
    N('lever_cro', 'CRO Experiments', ACT, 'A/B test funnel steps'),
    N('lever_speed', 'Page Speed Fixes', ACT, 'Core Web Vitals improvements'),
    N('hyp_intent', 'High-intent paid keywords convert 2× better', HYP),
  ],
  edges: [
    E('conversions', 'convvalue', 'Deterministic', 90),
    E('vpc', 'convvalue', 'Deterministic', 85),
    E('cvr', 'conversions', 'Deterministic', 85),
    E('sessions', 'conversions', 'Deterministic', 80),
    E('users', 'sessions', 'Causal', 80),
    E('spu', 'sessions', 'Deterministic', 75),
    E('organic', 'sessions', 'Compositional', 80),
    E('paid', 'sessions', 'Compositional', 75),
    E('social', 'sessions', 'Compositional', 60),
    E('direct', 'sessions', 'Compositional', 60),
    E('referral', 'sessions', 'Compositional', 55),
    E('engaged', 'cvr', 'Causal', 75),
    E('engrate', 'engaged', 'Deterministic', 80),
    E('avgdur', 'engrate', 'Causal', 65),
    E('ppp', 'engrate', 'Causal', 60),
    E('bounce', 'engrate', 'Causal', 60),
    E('newret', 'cvr', 'Causal', 55),
    E('lever_seo', 'organic', 'Causal', 75),
    E('lever_cro', 'cvr', 'Causal', 70),
    E('lever_speed', 'bounce', 'Causal', 65),
    E('hyp_intent', 'paid', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Acquisition', keys: ['sessions','users','spu','organic','paid','social','direct','referral'] },
    { name: 'Engagement', keys: ['engaged','engrate','avgdur','bounce','ppp','newret'] },
    { name: 'Conversion', keys: ['conversions','cvr','vpc'] },
  ],
};

// ===================== Company KPIs =====================
const company = {
  name: 'Company KPIs — Example Metric Tree',
  description:
    'Executive scorecard: enterprise value decomposed into growth, profitability, efficiency, and people health.',
  root: 'entval',
  nodes: [
    N('entval', 'Enterprise Value', VAL, 'Revenue × Multiple'),
    N('revenue', 'Revenue', MET, 'Total revenue'),
    N('growth', 'YoY Growth', MET, 'Revenue growth rate'),
    N('grossmargin', 'Gross Margin', MET, '(Revenue − COGS) ÷ Revenue'),
    N('ebitda', 'EBITDA', MET, 'Operating profitability'),
    N('newrev', 'New Business', MET, 'New logo revenue'),
    N('exprev', 'Expansion', MET, 'Upsell revenue'),
    N('churnrev', 'Churn', MET, 'Lost revenue'),
    N('nrr', 'Net Revenue Retention', MET, '(Start + Exp − Churn) ÷ Start'),
    N('cogs', 'COGS', MET, 'Cost of goods sold'),
    N('opex', 'OpEx', MET, 'Operating expenses'),
    N('salesmkt', 'Sales & Marketing', MET, 'GTM spend'),
    N('rnd', 'R&D', MET, 'Product investment'),
    N('ga', 'G&A', MET, 'Overhead'),
    N('headcount', 'Headcount', MET, 'Total employees'),
    N('revperhead', 'Revenue per Employee', MET, 'Revenue ÷ Headcount'),
    N('attrition', 'Attrition', MET, 'Voluntary churn of staff'),
    N('enps', 'Employee NPS', MET, 'Team health'),
    N('cashruntway', 'Runway (months)', MET, 'Cash ÷ Burn'),
    N('lever_pricing', 'Pricing & Packaging', ACT, 'Optimize price to expand NRR'),
    N('lever_hiring', 'Hiring Plan', ACT, 'Scale GTM + R&D'),
    N('hyp_efficiency', 'Automation lifts rev/head 15%', HYP),
  ],
  edges: [
    E('revenue', 'entval', 'Causal', 85),
    E('growth', 'entval', 'Causal', 75),
    E('grossmargin', 'entval', 'Causal', 70),
    E('newrev', 'revenue', 'Compositional', 80),
    E('exprev', 'revenue', 'Compositional', 75),
    E('churnrev', 'revenue', 'Causal', 70),
    E('nrr', 'growth', 'Causal', 75),
    E('exprev', 'nrr', 'Deterministic', 70),
    E('churnrev', 'nrr', 'Deterministic', 70),
    E('cogs', 'grossmargin', 'Deterministic', 80),
    E('grossmargin', 'ebitda', 'Causal', 75),
    E('opex', 'ebitda', 'Causal', 75),
    E('salesmkt', 'opex', 'Compositional', 75),
    E('rnd', 'opex', 'Compositional', 70),
    E('ga', 'opex', 'Compositional', 60),
    E('headcount', 'opex', 'Causal', 65),
    E('revperhead', 'ebitda', 'Causal', 55),
    E('headcount', 'revperhead', 'Deterministic', 70),
    E('attrition', 'headcount', 'Causal', 60),
    E('enps', 'attrition', 'Causal', 60),
    E('ebitda', 'cashruntway', 'Causal', 60),
    E('lever_pricing', 'exprev', 'Causal', 70),
    E('lever_hiring', 'headcount', 'Causal', 70),
    E('hyp_efficiency', 'revperhead', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Growth', keys: ['revenue','growth','newrev','exprev','churnrev','nrr'] },
    { name: 'Profitability', keys: ['grossmargin','ebitda','cogs','opex','salesmkt','rnd','ga'] },
    { name: 'People', keys: ['headcount','revperhead','attrition','enps'] },
  ],
};

// ===================== Marketing KPIs =====================
const marketing = {
  name: 'Marketing KPIs — Example Metric Tree',
  description:
    'Demand-gen tree: marketing-sourced pipeline from channels → MQL → SQL → won, with CAC and payback.',
  root: 'mktrev',
  nodes: [
    N('mktrev', 'Marketing-Sourced Revenue', VAL, 'Won Deals × ACV'),
    N('won', 'Won Deals', MET, 'Closed-won opportunities'),
    N('acv', 'Average Contract Value', MET, 'Revenue per deal'),
    N('sql', 'SQLs', MET, 'Sales-qualified leads'),
    N('sqlwin', 'SQL→Won Rate', MET, 'Win rate'),
    N('mql', 'MQLs', MET, 'Marketing-qualified leads'),
    N('mqlsql', 'MQL→SQL Rate', MET, 'Qualification rate'),
    N('leads', 'Leads', MET, 'Raw inbound leads'),
    N('leadmql', 'Lead→MQL Rate', MET, 'Scoring pass rate'),
    N('paidleads', 'Paid Leads', MET, 'From ads'),
    N('organicleads', 'Organic Leads', MET, 'From SEO/content'),
    N('eventleads', 'Event Leads', MET, 'From webinars/events'),
    N('referralleads', 'Referral Leads', MET, 'From partners'),
    N('spend', 'Marketing Spend', MET, 'Total budget'),
    N('cac', 'CAC', MET, 'Spend ÷ New Customers'),
    N('payback', 'CAC Payback (months)', MET, 'CAC ÷ (ACV × margin / 12)'),
    N('cpl', 'Cost per Lead', MET, 'Spend ÷ Leads'),
    N('roas', 'ROAS', MET, 'Revenue ÷ Ad Spend'),
    N('lever_abm', 'ABM Program', ACT, 'Target high-ACV accounts'),
    N('lever_nurture', 'Lead Nurture', ACT, 'Lift MQL→SQL with sequences'),
    N('lever_content', 'Content Engine', ACT, 'Grow organic leads'),
    N('hyp_events', 'Events produce highest SQL→Won', HYP),
  ],
  edges: [
    E('won', 'mktrev', 'Deterministic', 90),
    E('acv', 'mktrev', 'Deterministic', 80),
    E('sql', 'won', 'Deterministic', 80),
    E('sqlwin', 'won', 'Deterministic', 75),
    E('mql', 'sql', 'Deterministic', 80),
    E('mqlsql', 'sql', 'Deterministic', 75),
    E('leads', 'mql', 'Deterministic', 80),
    E('leadmql', 'mql', 'Deterministic', 70),
    E('paidleads', 'leads', 'Compositional', 75),
    E('organicleads', 'leads', 'Compositional', 70),
    E('eventleads', 'leads', 'Compositional', 55),
    E('referralleads', 'leads', 'Compositional', 50),
    E('spend', 'cac', 'Deterministic', 80),
    E('spend', 'cpl', 'Deterministic', 70),
    E('spend', 'paidleads', 'Causal', 70),
    E('cac', 'payback', 'Deterministic', 75),
    E('acv', 'payback', 'Causal', 60),
    E('mktrev', 'roas', 'Deterministic', 70),
    E('spend', 'roas', 'Deterministic', 70),
    E('lever_abm', 'acv', 'Causal', 65),
    E('lever_nurture', 'mqlsql', 'Causal', 70),
    E('lever_content', 'organicleads', 'Causal', 70),
    E('hyp_events', 'eventleads', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Channels', keys: ['paidleads','organicleads','eventleads','referralleads','leads'] },
    { name: 'Funnel', keys: ['mql','mqlsql','leadmql','sql','mqlsql','sqlwin','won','acv'] },
    { name: 'Efficiency', keys: ['spend','cac','payback','cpl','roas'] },
  ],
};

// ===================== Feature Launch =====================
const launch = {
  name: 'Feature Launch — Example Metric Tree',
  description:
    'Adoption tree for a new feature: awareness → activation → engagement → retention lift and its revenue impact.',
  root: 'impact',
  nodes: [
    N('impact', 'Feature Revenue Impact', VAL, 'Retained/expanded revenue from feature'),
    N('adopters', 'Active Adopters', MET, 'Users using the feature'),
    N('adoptrate', 'Adoption Rate', MET, 'Adopters ÷ Eligible Users'),
    N('eligible', 'Eligible Users', MET, 'Users who can access it'),
    N('aware', 'Aware Users', MET, 'Saw announcement/entry point'),
    N('awarerate', 'Awareness Rate', MET, 'Aware ÷ Eligible'),
    N('tried', 'Tried Once', MET, 'First-use users'),
    N('activation', 'Activation Rate', MET, 'Reached aha-moment'),
    N('wau', 'Weekly Active (feature)', MET, 'Repeat weekly usage'),
    N('depth', 'Usage Depth', MET, 'Actions per active user'),
    N('stickiness', 'Stickiness', MET, 'WAU ÷ MAU (feature)'),
    N('retlift', 'Retention Lift', MET, 'Retention of adopters − non-adopters'),
    N('exprate', 'Expansion Rate', MET, 'Upsell tied to feature'),
    N('csat', 'Feature CSAT', MET, 'Satisfaction score'),
    N('ttv', 'Time to Value', MET, 'Minutes to first value'),
    N('lever_onboard', 'In-product Onboarding', ACT, 'Tooltips + checklist'),
    N('lever_announce', 'Launch Campaign', ACT, 'Email + in-app announce'),
    N('lever_ttv', 'Reduce Time-to-Value', ACT, 'Templates + defaults'),
    N('hyp_activation', 'Onboarding checklist lifts activation 20%', HYP),
  ],
  edges: [
    E('adopters', 'impact', 'Causal', 80),
    E('retlift', 'impact', 'Causal', 75),
    E('exprate', 'impact', 'Causal', 65),
    E('adoptrate', 'adopters', 'Deterministic', 80),
    E('eligible', 'adopters', 'Causal', 70),
    E('aware', 'tried', 'Causal', 75),
    E('awarerate', 'aware', 'Deterministic', 70),
    E('tried', 'adoptrate', 'Causal', 70),
    E('activation', 'adoptrate', 'Causal', 75),
    E('ttv', 'activation', 'Causal', 70),
    E('wau', 'retlift', 'Causal', 70),
    E('depth', 'wau', 'Causal', 65),
    E('stickiness', 'retlift', 'Causal', 65),
    E('csat', 'retlift', 'Causal', 55),
    E('lever_onboard', 'activation', 'Causal', 75),
    E('lever_announce', 'awarerate', 'Causal', 70),
    E('lever_ttv', 'ttv', 'Causal', 70),
    E('hyp_activation', 'activation', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Awareness', keys: ['eligible','aware','awarerate','tried'] },
    { name: 'Activation', keys: ['adopters','adoptrate','activation','ttv'] },
    { name: 'Engagement & Retention', keys: ['wau','depth','stickiness','retlift','exprate','csat'] },
  ],
};

// ===================== Lifecycle / Cohort Analysis =====================
const cohort = {
  name: 'Lifecycle Cohort Analysis — Example Metric Tree',
  description:
    'Cohort LTV decomposition: acquisition → activation → retention curve → monetization, with resurrection and churn.',
  root: 'cohortltv',
  nodes: [
    N('cohortltv', 'Cohort LTV', VAL, 'Lifetime value per acquired user'),
    N('arpu', 'ARPU', MET, 'Avg revenue per user'),
    N('lifetime', 'Avg Lifetime (months)', MET, '1 ÷ churn'),
    N('newusers', 'New Users (cohort)', MET, 'Cohort size'),
    N('activated', 'Activated Users', MET, 'Reached first value'),
    N('actrate', 'Activation Rate', MET, 'Activated ÷ New'),
    N('d1', 'D1 Retention', MET, 'Active day 1'),
    N('d7', 'D7 Retention', MET, 'Active day 7'),
    N('d30', 'D30 Retention', MET, 'Active day 30'),
    N('m3', 'M3 Retention', MET, 'Active month 3'),
    N('churn', 'Monthly Churn', MET, 'Lost users per month'),
    N('resurrection', 'Resurrection Rate', MET, 'Reactivated dormant users'),
    N('payer', 'Payer Conversion', MET, 'Free → paid rate'),
    N('paidarpu', 'Paid ARPU', MET, 'Revenue per payer'),
    N('freq', 'Purchase Frequency', MET, 'Orders per active month'),
    N('engagement', 'Core Action / Week', MET, 'Habit metric'),
    N('lever_onboarding', 'Onboarding Redesign', ACT, 'Lift activation + D1'),
    N('lever_lifecycle', 'Lifecycle Messaging', ACT, 'Win-back + nudges'),
    N('lever_monetize', 'Monetization Experiments', ACT, 'Paywall + pricing'),
    N('hyp_habit', '3 core actions in week 1 → 2× M3 retention', HYP),
  ],
  edges: [
    E('arpu', 'cohortltv', 'Deterministic', 85),
    E('lifetime', 'cohortltv', 'Deterministic', 85),
    E('churn', 'lifetime', 'Deterministic', 80),
    E('newusers', 'activated', 'Causal', 70),
    E('actrate', 'activated', 'Deterministic', 75),
    E('activated', 'd1', 'Causal', 70),
    E('d1', 'd7', 'Causal', 75),
    E('d7', 'd30', 'Causal', 75),
    E('d30', 'm3', 'Causal', 75),
    E('m3', 'churn', 'Causal', 70),
    E('resurrection', 'churn', 'Causal', 55),
    E('engagement', 'd30', 'Causal', 65),
    E('payer', 'arpu', 'Causal', 75),
    E('paidarpu', 'arpu', 'Causal', 70),
    E('freq', 'paidarpu', 'Causal', 60),
    E('lever_onboarding', 'actrate', 'Causal', 75),
    E('lever_lifecycle', 'resurrection', 'Causal', 70),
    E('lever_monetize', 'payer', 'Causal', 70),
    E('hyp_habit', 'engagement', 'Probabilistic', 50),
  ],
  groups: [
    { name: 'Acquisition & Activation', keys: ['newusers','activated','actrate'] },
    { name: 'Retention Curve', keys: ['d1','d7','d30','m3','churn','resurrection','engagement'] },
    { name: 'Monetization', keys: ['arpu','payer','paidarpu','freq','lifetime'] },
  ],
};

const TREES = [saas, ecom, retail, web, company, marketing, launch, cohort];

// --- layered tree layout (root = 'profit' at top, drivers below) ---
function layout(tree) {
  const root = tree.root || 'profit';
  const children = new Map(); // parent -> [child]
  tree.nodes.forEach((n) => children.set(n.key, []));
  tree.edges.forEach((e) => {
    if (children.has(e.to)) children.get(e.to).push(e.from);
  });
  const level = new Map();
  const queue = [[root, 0]];
  level.set(root, 0);
  while (queue.length) {
    const [k, lv] = queue.shift();
    for (const c of children.get(k) || []) {
      if (!level.has(c) || level.get(c) < lv + 1) {
        level.set(c, lv + 1);
        queue.push([c, lv + 1]);
      }
    }
  }
  // Any node not reached (e.g. levers/hyps with only outgoing-to-leaf): place by their target's level+1
  tree.nodes.forEach((n) => {
    if (!level.has(n.key)) {
      const out = tree.edges.find((e) => e.from === n.key);
      level.set(n.key, out && level.has(out.to) ? level.get(out.to) + 1 : 1);
    }
  });
  const byLevel = new Map();
  tree.nodes.forEach((n) => {
    const lv = level.get(n.key);
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv).push(n.key);
  });
  const pos = new Map();
  for (const [lv, keys] of byLevel) {
    keys.forEach((k, i) => {
      const x = (i - (keys.length - 1) / 2) * 340;
      const y = lv * 200;
      pos.set(k, { x: Math.round(x), y: Math.round(y) });
    });
  }
  return pos;
}

// --- group-clustered layout: each group's cards laid out in its own grid
// region (non-overlapping frames), ungrouped cards in a row below. ---
const GC = { CARD_W: 280, CARD_H: 170, CELL_W: 330, CELL_H: 220, HEADER: 56, PAD: 30, GAP_X: 160, GAP_Y: 200, PER_ROW: 2 };
function groupClusteredLayout(tree) {
  const pos = new Map();
  const groups = tree.groups || [];
  const dims = groups.map((g) => {
    const n = g.keys.length;
    const cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(n))));
    const rows = Math.ceil(n / cols);
    const width = GC.PAD * 2 + (cols - 1) * GC.CELL_W + GC.CARD_W;
    const height = GC.HEADER + GC.PAD * 2 + (rows - 1) * GC.CELL_H + GC.CARD_H;
    return { g, cols, rows, width, height };
  });

  let placedInRow = 0;
  let rowStartY = 0;
  let rowHeight = 0;
  let xCursor = 0;
  for (const d of dims) {
    if (placedInRow === GC.PER_ROW) {
      rowStartY += rowHeight + GC.GAP_Y;
      xCursor = 0;
      placedInRow = 0;
      rowHeight = 0;
    }
    const fx = xCursor;
    const fy = rowStartY;
    d.g.keys.forEach((k, i) => {
      const col = i % d.cols;
      const row = Math.floor(i / d.cols);
      pos.set(k, {
        x: Math.round(fx + GC.PAD + col * GC.CELL_W),
        y: Math.round(fy + GC.HEADER + GC.PAD + row * GC.CELL_H),
      });
    });
    xCursor += d.width + GC.GAP_X;
    rowHeight = Math.max(rowHeight, d.height);
    placedInRow++;
  }

  // ungrouped cards (profit, levers, hypotheses) in a row below the regions
  const grouped = new Set(groups.flatMap((g) => g.keys));
  const ungrouped = tree.nodes.filter((n) => !grouped.has(n.key));
  const bottomY = rowStartY + rowHeight + GC.GAP_Y;
  const uCols = 6;
  ungrouped.forEach((n, i) => {
    pos.set(n.key, {
      x: Math.round((i % uCols) * GC.CELL_W),
      y: Math.round(bottomY + Math.floor(i / uCols) * GC.CELL_H),
    });
  });

  return pos;
}

// --- build rows + SQL ---
const sqlEsc = (s) => String(s).replace(/'/g, "''");
let sql = `-- Example metric trees (SaaS / E-commerce / Retail). Owner: ${OWNER}\n-- Re-runnable: deletes prior projects with the same names (cascade) first.\nBEGIN;\n`;

// Derive change_percent + trend from raw {period,value} points (mirrors the app's
// deriveSeries in sourceBinding.ts — keep the two in sync conceptually).
function derive(rows) {
  let prev = null;
  return rows.map(({ period, value }) => {
    const change_percent =
      prev == null || prev === 0 ? 0 : round(((value - prev) / prev) * 100, 1);
    const trend =
      change_percent > 1 ? 'up' : change_percent < -1 ? 'down' : 'neutral';
    prev = value;
    return { period, value, change_percent, trend };
  });
}

// Pick a meaningful quantitative card to anchor the showcase pipeline on
// (revenue-like preferred), falling back to any non-root quantitative card.
function pickAnchor(tree) {
  const pref = /(mrr|revenue|orders|transactions|sales|gmv|bookings|sessions|signups|activation|arr)/i;
  const root = tree.root || 'profit';
  const q = tree.nodes.filter((n) => isQuantitative(n.cat));
  return (
    q.find((n) => pref.test(n.key)) ||
    q.find((n) => pref.test(n.title)) ||
    q.find((n) => n.key !== root) ||
    q[0]
  );
}

// Build a complete, COMPUTABLE showcase pipeline that exercises every canvas node
// type: Source → Operator → (Projection) Card → Chart, plus a Comment + a
// Whiteboard label. Placed in a clear region to the right of the tree. The
// operator's output is pre-baked into the projection card so charts look good on
// load; "Run Simulation" recomputes the latest point live.
function buildShowcase({ tree, idOf, pos, projectId, dataByKey }) {
  const anchor = pickAnchor(tree);
  if (!anchor) return null;
  const anchorId = idOf.get(anchor.key);
  const anchorTitle = anchor.title;
  const anchorData = dataByKey.get(anchor.key) || [];
  const periods = anchorData.length
    ? anchorData.map((d) => d.period)
    : monthsBack(7);

  // Source: a small "live feed" that grows ~4%/mo, ~5% the size of the anchor.
  const feedBase = Math.max(100, round((anchorData.at(-1)?.value || 10000) * 0.05));
  const sourceRaw = periods.map((period, i) => ({
    period,
    value: round(feedBase * (1 + 0.04 * i)),
  }));
  const sourceSeries = derive(sourceRaw);

  // Operator output (pre-baked): anchor × 1.1 + feed, per period.
  const projectionRaw = periods.map((period, i) => ({
    period,
    value: round((anchorData[i]?.value || 0) * 1.1 + (sourceRaw[i]?.value || 0)),
  }));
  const projectionData = derive(projectionRaw);

  const sourceId = randomUUID();
  const operatorId = randomUUID();
  const projectionCardId = randomUUID();
  const chartId = randomUUID();
  const commentId = randomUUID();
  const whiteboardId = randomUUID();

  // Region to the right of the widest card column.
  const maxX = Math.max(0, ...[...pos.values()].map((p) => p.x));
  const x0 = maxX + 520;
  const baseY = 0;

  const projectionCard = {
    id: projectionCardId,
    project_id: projectId,
    title: `${anchorTitle} — Projection`,
    description: `Operator output: ${anchorTitle} × 1.1 + live feed`,
    category: MET,
    sub_category: null,
    status: null,
    workflow: {},
    tracked_metric_id: null,
    position_x: x0 + 720,
    position_y: baseY,
    created_by: OWNER,
    data: projectionData,
  };

  const node = (id, nodeType, title, x, y, data) => ({
    id,
    project_id: projectId,
    node_type: nodeType,
    title,
    position_x: x,
    position_y: y,
    data,
    created_by: OWNER,
  });

  const canvasNodes = [
    node(whiteboardId, 'whiteboardNode', 'Label', x0, baseY - 170, {
      shape: 'text',
      text: '📊 Live Data Pipeline',
      fontSize: 18,
      width: 300,
      height: 96,
      fill: '#eef2ff',
      stroke: '#6366f1',
    }),
    node(sourceId, 'sourceNode', 'Live Feed', x0, baseY, {
      title: 'Live Feed (new bookings)',
      config: { origin: 'manual', rows: sourceRaw },
      series: sourceSeries,
      refreshedAt: new Date().toISOString(),
    }),
    node(operatorId, 'operatorNode', 'Projection', x0 + 360, baseY, {
      label: 'Projection (a × 1.1 + feed)',
      operationType: 'formula',
      isActive: true,
      formula: 'a * 1.1 + b',
      inputs: [
        { key: 'a', sourceId: anchorId, label: anchorTitle },
        { key: 'b', sourceId: sourceId, label: 'Live feed' },
      ],
    }),
    node(chartId, 'chartNode', 'Actual vs Projection', x0 + 1100, baseY, {
      chartType: 'area',
      title: 'Actual vs Projection',
      seriesCardIds: [anchorId, projectionCardId],
      showLegend: true,
    }),
    node(commentId, 'commentNode', 'Pipeline', x0, baseY + 260, {
      title:
        'Live pipeline: Source → Operator → Card → Chart. Edit the Source, then Run Simulation.',
      projectId,
    }),
  ];

  const edge = (source, target) => ({
    id: randomUUID(),
    source,
    target,
    type: 'dataFlow',
  });
  const dataFlowEdges = [
    edge(sourceId, operatorId), // feed → operator input b
    edge(anchorId, operatorId), // anchor card → operator input a
    edge(operatorId, projectionCardId), // operator writes the projection card
    edge(anchorId, chartId), // chart plots the anchor…
    edge(projectionCardId, chartId), // …and the projection
  ];

  return { canvasNodes, projectionCard, dataFlowEdges };
}

function buildTree(tree) {
  // Tree (dependency) layout is the example default; frames wrap their members
  // and overlap (translucent), which the user accepted. Auto-layout (group-aware)
  // re-flows to Dagre on demand. Swap to groupClusteredLayout for clean grids.
  const pos = layout(tree);
  const projectId = randomUUID();
  const idOf = new Map();
  tree.nodes.forEach((n) => idOf.set(n.key, randomUUID()));

  // Generate each card's series once and reuse it (so the showcase pipeline can
  // read the anchor card's actual data, not a fresh random series).
  const dataByKey = new Map(
    tree.nodes.map((n) => [
      n.key,
      isQuantitative(n.cat) ? makeSeries(n.title) : [],
    ])
  );

  const project = {
    id: projectId,
    name: tree.name,
    description: tree.description,
    created_by: OWNER,
    last_modified_by: OWNER,
    is_public: IS_PUBLIC,
    tags: ['example', 'template'],
    settings: {},
  };
  // Cards, enriched so the Strategy board / journey strip have real content:
  // actions & hypotheses get sub_category + status + workflow, values get their
  // Core/Value subtype.
  let actIdx = 0;
  let hypIdx = 0;
  const cards = tree.nodes.map((n) => {
    const card = {
      id: idOf.get(n.key),
      project_id: projectId,
      title: n.title,
      description: n.desc || '',
      category: n.cat,
      sub_category: null,
      status: null,
      workflow: {},
      tracked_metric_id: null,
      position_x: pos.get(n.key).x,
      position_y: pos.get(n.key).y,
      created_by: OWNER,
      data: dataByKey.get(n.key),
    };
    if (n.cat === ACT) {
      const i = actIdx++;
      card.sub_category = ACTION_SUBCATS[i % ACTION_SUBCATS.length];
      card.status = ACT_STATUS_CYCLE[i % ACT_STATUS_CYCLE.length];
      card.workflow = {
        priority: PRIORITY_CYCLE[i % PRIORITY_CYCLE.length],
        dueDate: isoDaysFromNow(14 + i * 21),
        effort: 3 + (i % 4) * 4,
      };
    } else if (n.cat === HYP) {
      const i = hypIdx++;
      card.sub_category = 'Factor';
      card.status = HYP_STATUS_CYCLE[i % HYP_STATUS_CYCLE.length];
      card.workflow = {
        confidence: PRIORITY_CYCLE[i % PRIORITY_CYCLE.length],
        testable: true,
        assumptions: [`${n.title} holds for the core segment`],
        successCriteria: ['Statistically significant lift within one quarter'],
      };
    } else if (n.cat === VAL) {
      card.sub_category = 'Critical Path';
      card.workflow = { businessImpact: 'High' };
    }
    return card;
  });
  const relIdByEdge = new Map();
  const rels = tree.edges.map((e) => {
    const id = randomUUID();
    relIdByEdge.set(`${e.from}->${e.to}`, id);
    return {
      id,
      project_id: projectId,
      source_id: idOf.get(e.from),
      target_id: idOf.get(e.to),
      type: e.type,
      confidence: e.conf,
      weight: e.w,
      created_by: OWNER,
    };
  });

  // Journey steps (Core/Value) for the Strategy page's value strip: a row of
  // Journey Step cards above the tree, ordered left→right (position.x = journey
  // order), wired to their driving metrics and attached work.
  (tree.journey || []).forEach((j, i) => {
    const jid = randomUUID();
    idOf.set(j.key, jid);
    // Entirely left of the root (x=0) so the journey strip reads
    // step 1 → step 2 → step 3 → root value (position.x = journey order).
    const x = Math.round((i - tree.journey.length) * 720);
    pos.set(j.key, { x, y: -380 });
    cards.push({
      id: jid,
      project_id: projectId,
      title: j.title,
      description: j.desc || '',
      category: VAL,
      sub_category: 'Journey Step',
      status: null,
      workflow: {
        businessImpact: i === tree.journey.length - 1 ? 'Medium' : 'High',
        stakeholders: ['Growth', 'Product'],
      },
      tracked_metric_id: null,
      position_x: x,
      position_y: -380,
      created_by: OWNER,
      data: [],
    });
    for (const link of j.links || []) {
      if (!idOf.get(link)) continue;
      rels.push({
        id: randomUUID(),
        project_id: projectId,
        source_id: idOf.get(link),
        target_id: jid,
        type: 'Compositional',
        confidence: 'High',
        weight: 70,
        created_by: OWNER,
      });
    }
    for (const w of j.work || []) {
      if (!idOf.get(w)) continue;
      rels.push({
        id: randomUUID(),
        project_id: projectId,
        source_id: idOf.get(w),
        target_id: jid,
        type: 'Causal',
        confidence: 'Medium',
        weight: 60,
        created_by: OWNER,
      });
    }
  });

  const SEED_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6'];
  // A group holding every action + hypothesis gives the Strategy page its
  // per-group pill (the work-card analog of group → dashboard).
  const workKeys = tree.nodes
    .filter((n) => n.cat === ACT || n.cat === HYP)
    .map((n) => n.key);
  const groupDefs = [...(tree.groups || [])];
  if (workKeys.length) {
    groupDefs.push({ name: 'Strategy — Levers & Bets', keys: workKeys });
  }
  const groupRows = groupDefs.map((g, gi) => {
    const ps = g.keys.map((k) => pos.get(k)).filter(Boolean);
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    // Frame wraps the group's members, with room above the cards for the header.
    return {
      id: randomUUID(),
      project_id: projectId,
      name: g.name,
      color: SEED_COLORS[gi % SEED_COLORS.length],
      node_ids: g.keys.map((k) => idOf.get(k)).filter(Boolean),
      position_x: Math.round(minX - GC.PAD),
      position_y: Math.round(minY - GC.HEADER - GC.PAD),
      width: Math.round(maxX - minX + GC.CARD_W + GC.PAD * 2),
      height: Math.round(maxY - minY + GC.CARD_H + GC.HEADER + GC.PAD * 2),
      created_by: OWNER,
    };
  });

  // Showcase pipeline: source → operator → projection card → chart (+ comment +
  // whiteboard). Adds canvas_nodes + dataFlowEdges so every node type is used.
  const showcase = buildShowcase({ tree, idOf, pos, projectId, dataByKey });
  const canvasNodes = showcase?.canvasNodes || [];
  if (showcase) {
    cards.push(showcase.projectionCard);
    project.settings = { dataFlowEdges: showcase.dataFlowEdges };
  }

  // --- semantic layer: promote the anchor card into the Tracked Metrics
  // catalog, with a real value-store series (two-tier storage). ---
  const anchor = pickAnchor(tree);
  const anchorId = anchor ? idOf.get(anchor.key) : null;
  const anchorData = anchor ? dataByKey.get(anchor.key) || [] : [];
  const shortName = tree.name.split('—')[0].trim();
  const trackedId = randomUUID();
  const trackedName = anchor ? `${anchor.title} — ${shortName}` : null;
  const trackedMetrics = anchor
    ? [
        {
          id: trackedId,
          name: trackedName,
          state: 'tracked',
          unit: guessUnit(anchor.title),
          formula: null,
          owner_label: 'Growth',
          source_kind: 'manual',
          origin_card_id: anchorId,
          origin_project_id: projectId,
          created_by: OWNER,
        },
      ]
    : [];
  const metricValues = anchorData.map((d) => ({
    id: randomUUID(),
    tracked_metric_id: trackedId,
    period: d.period,
    value: d.value,
    change_percent: d.change_percent,
    trend: d.trend,
    source: 'seed',
    created_by: OWNER,
  }));
  if (anchor) {
    const anchorCard = cards.find((c) => c.id === anchorId);
    if (anchorCard) anchorCard.tracked_metric_id = trackedId;
  }

  // --- evidence on the strongest causal/probabilistic edges ---
  const evidenceRows = [...tree.edges]
    .filter((e) => e.type === 'Causal' || e.type === 'Probabilistic')
    .sort((a, b) => b.w - a.w)
    .slice(0, 3)
    .map((e, i) => {
      const from = tree.nodes.find((n) => n.key === e.from)?.title || e.from;
      const to = tree.nodes.find((n) => n.key === e.to)?.title || e.to;
      return {
        id: randomUUID(),
        relationship_id: relIdByEdge.get(`${e.from}->${e.to}`),
        title: `${EVIDENCE_TYPES[i % EVIDENCE_TYPES.length]}: ${from} → ${to}`,
        type: EVIDENCE_TYPES[i % EVIDENCE_TYPES.length],
        date: isoDaysFromNow(-7 * (i + 1)),
        summary: `Observed a consistent relationship between ${from} and ${to} over the last two quarters; effect size supports the current ${e.conf.toLowerCase()}-confidence rating.`,
        hypothesis: `${from} is a leading driver of ${to}`,
        link: null,
        impact_on_confidence: i === 0 ? 'Increases confidence' : 'Supports current rating',
        owner_id: OWNER,
        created_by: OWNER,
      };
    })
    .filter((e) => e.relationship_id);

  // --- comments: one open thread on the anchor card + one resolved canvas
  // thread, so the collaboration panel has content. ---
  const nodeThreadId = randomUUID();
  const canvasThreadId = randomUUID();
  const commentThreads = anchor
    ? [
        {
          id: nodeThreadId,
          project_id: projectId,
          source: 'node',
          context: { cardId: anchorId },
          is_resolved: false,
          created_by: OWNER,
        },
        {
          id: canvasThreadId,
          project_id: projectId,
          source: 'canvas',
          context: null,
          is_resolved: true,
          created_by: OWNER,
        },
      ]
    : [];
  const commentRows = anchor
    ? [
        {
          id: randomUUID(),
          thread_id: nodeThreadId,
          author_id: OWNER,
          content: `${anchor.title} is our anchor metric — the operator projection to the right recomputes it live. Does the seasonality here look right?`,
          resolved: false,
        },
        {
          id: randomUUID(),
          thread_id: nodeThreadId,
          author_id: OWNER,
          content: 'Compared it against the tracked-metric series in the catalog — trends match. Leaving this open until we wire the warehouse source.',
          resolved: false,
        },
        {
          id: randomUUID(),
          thread_id: canvasThreadId,
          author_id: OWNER,
          content: 'Grouped the levers & bets into a Strategy group — check the Strategy page for the kanban view.',
          resolved: true,
        },
      ]
    : [];

  // --- dashboard widgets: KPI (tracked), driver chart (cards), summary table ---
  const chartCardIds = [
    anchorId,
    showcase?.projectionCard?.id,
    ...cards
      .filter((c) => c.category === MET && c.id !== anchorId && (c.data?.length ?? 0) > 0)
      .slice(0, 2)
      .map((c) => c.id),
  ].filter(Boolean);
  const widgets = anchor
    ? [
        {
          id: randomUUID(),
          project_id: projectId,
          title: trackedName,
          widget_type: 'kpi',
          config: { source: 'tracked', trackedMetricIds: [trackedId] },
          layout: { x: 0, y: 0, w: 3, h: 4 },
          sort_index: 0,
          created_by: OWNER,
        },
        {
          id: randomUUID(),
          project_id: projectId,
          title: `${anchor.title} & drivers`,
          widget_type: 'area',
          config: { source: 'card', cardIds: chartCardIds, display: { showLegend: true } },
          layout: { x: 3, y: 0, w: 9, h: 8 },
          sort_index: 1,
          created_by: OWNER,
        },
        {
          id: randomUUID(),
          project_id: projectId,
          title: 'Key metrics',
          widget_type: 'table',
          config: { source: 'card', cardIds: chartCardIds },
          layout: { x: 0, y: 4, w: 3, h: 8 },
          sort_index: 2,
          created_by: OWNER,
        },
      ]
    : [];

  // --- alert rules on the anchor: a floor threshold + a drop alert ---
  const latestAnchor = anchorData.at(-1)?.value ?? 0;
  const alertRules = anchor
    ? [
        {
          id: randomUUID(),
          project_id: projectId,
          card_id: anchorId,
          name: `${anchor.title} floor`,
          rule_type: 'threshold',
          config: { comparator: 'lte', value: round(latestAnchor * 0.85) },
          enabled: true,
          created_by: OWNER,
        },
        {
          id: randomUUID(),
          project_id: projectId,
          card_id: anchorId,
          name: `${anchor.title} sudden drop`,
          rule_type: 'change',
          config: { direction: 'down', pct: 10 },
          enabled: true,
          created_by: OWNER,
        },
      ]
    : [];

  // SQL
  const S = (v) => (v == null ? 'NULL' : `'${sqlEsc(v)}'`);
  const J = (v) => `'${sqlEsc(JSON.stringify(v ?? null))}'::jsonb`;
  sql += `\nDELETE FROM public.projects WHERE created_by='${OWNER}' AND name='${sqlEsc(tree.name)}';\n`;
  if (trackedName)
    sql += `DELETE FROM public.tracked_metrics WHERE created_by='${OWNER}' AND name='${sqlEsc(trackedName)}';\n`;
  sql += `INSERT INTO public.projects (id,name,description,created_by,last_modified_by,is_public,tags,settings) VALUES ('${projectId}','${sqlEsc(tree.name)}','${sqlEsc(tree.description)}','${OWNER}','${OWNER}',${IS_PUBLIC},ARRAY['example','template'],'${sqlEsc(JSON.stringify(project.settings))}'::jsonb);\n`;
  for (const t of trackedMetrics)
    sql += `INSERT INTO public.tracked_metrics (id,name,state,unit,formula,owner_label,source_kind,origin_card_id,origin_project_id,created_by) VALUES ('${t.id}',${S(t.name)},'${t.state}',${S(t.unit)},${S(t.formula)},${S(t.owner_label)},${S(t.source_kind)},'${t.origin_card_id}','${t.origin_project_id}','${OWNER}');\n`;
  for (const c of cards)
    sql += `INSERT INTO public.metric_cards (id,project_id,title,description,category,sub_category,status,workflow,tracked_metric_id,position_x,position_y,created_by,data) VALUES ('${c.id}','${c.project_id}','${sqlEsc(c.title)}','${sqlEsc(c.description)}','${c.category}',${S(c.sub_category)},${S(c.status)},${J(c.workflow ?? {})},${c.tracked_metric_id ? `'${c.tracked_metric_id}'` : 'NULL'},${c.position_x},${c.position_y},'${OWNER}',${J(c.data)});\n`;
  for (const v of metricValues)
    sql += `INSERT INTO public.metric_values (id,tracked_metric_id,period,value,change_percent,trend,source,created_by) VALUES ('${v.id}','${v.tracked_metric_id}','${v.period}',${v.value},${v.change_percent},${S(v.trend)},'seed','${OWNER}');\n`;
  for (const r of rels)
    sql += `INSERT INTO public.relationships (id,project_id,source_id,target_id,type,confidence,weight,created_by) VALUES ('${r.id}','${r.project_id}','${r.source_id}','${r.target_id}','${r.type}','${r.confidence}',${r.weight},'${OWNER}');\n`;
  for (const ev of evidenceRows)
    sql += `INSERT INTO public.evidence_items (id,relationship_id,title,type,date,summary,hypothesis,link,impact_on_confidence,owner_id,created_by) VALUES ('${ev.id}','${ev.relationship_id}','${sqlEsc(ev.title)}','${ev.type}','${ev.date}','${sqlEsc(ev.summary)}',${S(ev.hypothesis)},${S(ev.link)},${S(ev.impact_on_confidence)},'${OWNER}','${OWNER}');\n`;
  for (const g of groupRows)
    sql += `INSERT INTO public.groups (id,project_id,name,color,node_ids,position_x,position_y,width,height,created_by) VALUES ('${g.id}','${g.project_id}','${sqlEsc(g.name)}','${g.color}',ARRAY[${g.node_ids.map((id) => `'${id}'`).join(',')}]::uuid[],${g.position_x},${g.position_y},${g.width},${g.height},'${OWNER}');\n`;
  for (const cn of canvasNodes)
    sql += `INSERT INTO public.canvas_nodes (id,project_id,node_type,title,position_x,position_y,data,created_by) VALUES ('${cn.id}','${cn.project_id}','${cn.node_type}','${sqlEsc(cn.title)}',${cn.position_x},${cn.position_y},'${sqlEsc(JSON.stringify(cn.data))}'::jsonb,'${OWNER}');\n`;
  for (const th of commentThreads)
    sql += `INSERT INTO public.comment_threads (id,project_id,source,context,is_resolved,created_by) VALUES ('${th.id}','${th.project_id}','${th.source}',${th.context ? J(th.context) : 'NULL'},${th.is_resolved},'${OWNER}');\n`;
  for (const cm of commentRows)
    sql += `INSERT INTO public.comments (id,thread_id,author_id,content,resolved) VALUES ('${cm.id}','${cm.thread_id}','${OWNER}','${sqlEsc(cm.content)}',${cm.resolved});\n`;
  for (const w of widgets)
    sql += `INSERT INTO public.dashboard_widgets (id,project_id,title,widget_type,config,layout,sort_index,created_by) VALUES ('${w.id}','${w.project_id}',${S(w.title)},'${w.widget_type}',${J(w.config)},${J(w.layout)},${w.sort_index},'${OWNER}');\n`;
  for (const a of alertRules)
    sql += `INSERT INTO public.alert_rules (id,project_id,card_id,name,rule_type,config,enabled,created_by) VALUES ('${a.id}','${a.project_id}','${a.card_id}',${S(a.name)},'${a.rule_type}',${J(a.config)},${a.enabled},'${OWNER}');\n`;

  return {
    project,
    cards,
    rels,
    groups: groupRows,
    canvasNodes,
    trackedMetrics,
    trackedName,
    metricValues,
    evidenceRows,
    commentThreads,
    commentRows,
    widgets,
    alertRules,
  };
}

const built = TREES.map(buildTree);
sql += '\nCOMMIT;\n';

// write reusable SQL
mkdirSync(resolve(ROOT, 'scripts/seed'), { recursive: true });
writeFileSync(resolve(ROOT, 'scripts/seed/example-metric-trees.sql'), sql);
console.log('📝 Wrote scripts/seed/example-metric-trees.sql');

// Dry run: generate + write the SQL for inspection without touching the DB.
if (process.argv.includes('--dry')) {
  console.log(
    `🧪 Dry run — wrote SQL only. ${built.reduce((s, b) => s + (b.canvasNodes?.length || 0), 0)} canvas nodes across ${built.length} projects.`
  );
  process.exit(0);
}

// --- insert via service role (bypasses RLS) ---
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function insertAll(table, rows, label) {
  if (!rows || !rows.length) return;
  const { error } = await db.from(table).insert(rows);
  if (error) throw new Error(`${table} ${label}: ${error.message}`);
}

for (const b of built) {
  const { project } = b;
  await db.from('projects').delete().eq('created_by', OWNER).eq('name', project.name);
  if (b.trackedName) {
    // tracked_metrics are workspace-scoped (survive project deletes); clear the
    // prior run's entry so re-runs don't duplicate. metric_values cascade.
    await db
      .from('tracked_metrics')
      .delete()
      .eq('created_by', OWNER)
      .eq('name', b.trackedName);
  }
  let { error: pe } = await db.from('projects').insert(project);
  if (pe) throw new Error(`project ${project.name}: ${pe.message}`);
  // tracked_metrics before cards: metric_cards.tracked_metric_id FK.
  await insertAll('tracked_metrics', b.trackedMetrics, project.name);
  await insertAll('metric_values', b.metricValues, project.name);
  await insertAll('metric_cards', b.cards, project.name);
  await insertAll('relationships', b.rels, project.name);
  await insertAll('evidence_items', b.evidenceRows, project.name);
  await insertAll('groups', b.groups, project.name);
  await insertAll('canvas_nodes', b.canvasNodes, project.name);
  await insertAll('comment_threads', b.commentThreads, project.name);
  await insertAll('comments', b.commentRows, project.name);
  await insertAll('dashboard_widgets', b.widgets, project.name);
  await insertAll('alert_rules', b.alertRules, project.name);
  console.log(
    `✅ ${project.name}: ${b.cards.length} cards, ${b.rels.length} relationships, ${b.groups.length} groups, ${b.canvasNodes.length} canvas nodes, ${b.evidenceRows.length} evidence, ${b.commentRows.length} comments, ${b.widgets.length} widgets, ${b.alertRules.length} alerts, ${b.trackedMetrics.length} tracked (+${b.metricValues.length} values)`
  );
}
console.log('🌱 Seed complete.');
