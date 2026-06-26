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
};

const TREES = [saas, ecom, retail];

// --- layered tree layout (root = 'profit' at top, drivers below) ---
function layout(tree) {
  const children = new Map(); // parent -> [child]
  tree.nodes.forEach((n) => children.set(n.key, []));
  tree.edges.forEach((e) => {
    if (children.has(e.to)) children.get(e.to).push(e.from);
  });
  const level = new Map();
  const queue = [['profit', 0]];
  level.set('profit', 0);
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

// --- build rows + SQL ---
const sqlEsc = (s) => String(s).replace(/'/g, "''");
let sql = `-- Example metric trees (SaaS / E-commerce / Retail). Owner: ${OWNER}\n-- Re-runnable: deletes prior projects with the same names (cascade) first.\nBEGIN;\n`;

function buildTree(tree) {
  const pos = layout(tree);
  const projectId = randomUUID();
  const idOf = new Map();
  tree.nodes.forEach((n) => idOf.set(n.key, randomUUID()));

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
  const cards = tree.nodes.map((n) => ({
    id: idOf.get(n.key),
    project_id: projectId,
    title: n.title,
    description: n.desc || '',
    category: n.cat,
    position_x: pos.get(n.key).x,
    position_y: pos.get(n.key).y,
    created_by: OWNER,
    data: isQuantitative(n.cat) ? makeSeries(n.title) : [],
  }));
  const rels = tree.edges.map((e) => ({
    id: randomUUID(),
    project_id: projectId,
    source_id: idOf.get(e.from),
    target_id: idOf.get(e.to),
    type: e.type,
    confidence: e.conf,
    weight: e.w,
    created_by: OWNER,
  }));

  const groupRows = (tree.groups || []).map((g) => {
    const ps = g.keys.map((k) => pos.get(k)).filter(Boolean);
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = 40;
    return {
      id: randomUUID(),
      project_id: projectId,
      name: g.name,
      node_ids: g.keys.map((k) => idOf.get(k)).filter(Boolean),
      position_x: Math.round(minX - pad),
      position_y: Math.round(minY - pad),
      width: Math.round(maxX - minX + 260 + pad * 2),
      height: Math.round(maxY - minY + 130 + pad * 2),
      created_by: OWNER,
    };
  });

  // SQL
  sql += `\nDELETE FROM public.projects WHERE created_by='${OWNER}' AND name='${sqlEsc(tree.name)}';\n`;
  sql += `INSERT INTO public.projects (id,name,description,created_by,last_modified_by,is_public,tags,settings) VALUES ('${projectId}','${sqlEsc(tree.name)}','${sqlEsc(tree.description)}','${OWNER}','${OWNER}',${IS_PUBLIC},ARRAY['example','template'],'{}');\n`;
  for (const c of cards)
    sql += `INSERT INTO public.metric_cards (id,project_id,title,description,category,position_x,position_y,created_by,data) VALUES ('${c.id}','${c.project_id}','${sqlEsc(c.title)}','${sqlEsc(c.description)}','${c.category}',${c.position_x},${c.position_y},'${OWNER}','${sqlEsc(JSON.stringify(c.data))}'::jsonb);\n`;
  for (const r of rels)
    sql += `INSERT INTO public.relationships (id,project_id,source_id,target_id,type,confidence,weight,created_by) VALUES ('${r.id}','${r.project_id}','${r.source_id}','${r.target_id}','${r.type}','${r.confidence}',${r.weight},'${OWNER}');\n`;
  for (const g of groupRows)
    sql += `INSERT INTO public.groups (id,project_id,name,node_ids,position_x,position_y,width,height,created_by) VALUES ('${g.id}','${g.project_id}','${sqlEsc(g.name)}',ARRAY[${g.node_ids.map((id) => `'${id}'`).join(',')}]::uuid[],${g.position_x},${g.position_y},${g.width},${g.height},'${OWNER}');\n`;

  return { project, cards, rels, groups: groupRows };
}

const built = TREES.map(buildTree);
sql += '\nCOMMIT;\n';

// write reusable SQL
mkdirSync(resolve(ROOT, 'scripts/seed'), { recursive: true });
writeFileSync(resolve(ROOT, 'scripts/seed/example-metric-trees.sql'), sql);
console.log('📝 Wrote scripts/seed/example-metric-trees.sql');

// --- insert via service role (bypasses RLS) ---
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

for (const { project, cards, rels, groups } of built) {
  await db.from('projects').delete().eq('created_by', OWNER).eq('name', project.name);
  let { error: pe } = await db.from('projects').insert(project);
  if (pe) throw new Error(`project ${project.name}: ${pe.message}`);
  let { error: ce } = await db.from('metric_cards').insert(cards);
  if (ce) throw new Error(`cards ${project.name}: ${ce.message}`);
  let { error: re } = await db.from('relationships').insert(rels);
  if (re) throw new Error(`relationships ${project.name}: ${re.message}`);
  if (groups && groups.length) {
    let { error: ge } = await db.from('groups').insert(groups);
    if (ge) throw new Error(`groups ${project.name}: ${ge.message}`);
  }
  console.log(
    `✅ ${project.name}: ${cards.length} cards, ${rels.length} relationships, ${(groups || []).length} groups`
  );
}
console.log('🌱 Seed complete.');
