/**
 * Scene scripts for e2e/record-loops.mjs — one per operating loop that needs
 * an authenticated app surface. Each scene receives a signed-in page on the
 * app home and must drive a REAL flow (honest takes only), ~10–20s.
 */
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';

const demoCanvas = () =>
  JSON.parse(readFileSync('e2e/loops/demo-canvas.json', 'utf8'));

/** Run an e2e/agent-run.mts mode; resolves when the child exits. */
const agentRun = (mode) =>
  new Promise((resolve, reject) => {
    execFile('npx', ['tsx', 'e2e/agent-run.mts', mode], (err, stdout, stderr) => {
      if (err) reject(new Error(`agent-run ${mode} failed: ${stderr || stdout}`));
      else resolve(stdout);
    });
  });

export function defineScenes({ sleep, glide, glideClick, pan, fitView, zoomIn, typeSlow }) {
  return {
    /**
     * Agent/MCP → operating map: empty canvas → Agent connect page while a
     * REAL MCP registry run (create_value/metric/action + relationships +
     * layout_tree) builds the tree → back on the canvas, the map has landed.
     */
    'agent-to-operating-map': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__viewport', { timeout: 30_000 });
      await sleep(1500);
      page.__start(); // take begins on the loaded, empty canvas
      await sleep(2200); // the "before"
      const run = agentRun('seed'); // the agent run starts NOW
      await page.goto('/settings/connect', { waitUntil: 'domcontentloaded' });
      await sleep(2200);
      await glide(page, { x: 640, y: 430 }, 900);
      await page.mouse.wheel(0, 420);
      await sleep(1500);
      await run; // agent finished building the tree
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__node', { timeout: 30_000 });
      await sleep(3000); // graph + edges settle
      await fitView(page, 900);
      await zoomIn(page, 1, 700);
      await fitView(page, 800);
      await sleep(1800);
      page.__cut();
    },
    /**
     * Experimentation → knowledge: the hypothesis card (wired to its
     * experiment action) → card sheet Evidence tab → "New evidence pin" —
     * a real evidence pin + reference edge land on the canvas and the
     * evidence editor opens.
     */
    'experimentation-to-knowledge': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__node', { timeout: 30_000 });
      await sleep(4000); // graph settles
      await fitView(page, 900);
      page.__start();
      await sleep(1000); // establish: hypothesis → action → metrics
      const hyp = page.locator('.react-flow__node', { hasText: 'Faster time-to-aha' }).first();
      const box = await hyp.boundingBox();
      await glide(page, { x: box.x + box.width / 2, y: box.y + 30 }, 900);
      await hyp.dblclick({ position: { x: box.width / 2, y: 30 } });
      // Hypothesis cards open the HYPOTHESIS task panel (Workflow → Evidence
      // → Discussion), not the tabbed metric sheet.
      await page.getByText('Evidence', { exact: true }).first().waitFor({ timeout: 15_000 });
      await sleep(1300); // panel open — hypothesis, workflow, evidence
      const evidenceAdd = page
        .locator('section, div')
        .filter({ has: page.getByText('Evidence', { exact: true }) })
        .getByRole('button', { name: 'Add' })
        .last();
      await glideClick(page, evidenceAdd, 700);
      await page.getByText('Attach Evidence').waitFor({ timeout: 10_000 });
      await sleep(800);
      await glideClick(page, page.getByPlaceholder('Evidence title'), 550);
      await typeSlow(page, 'Onboarding A/B — cohort result', 32);
      await glideClick(
        page,
        page.getByPlaceholder('Evidence summary and key findings'),
        600
      );
      await typeSlow(page, 'Checklist variant: activation +4.2pp in week 1.', 30);
      await sleep(400);
      await glideClick(page, page.getByRole('button', { name: 'Create Evidence' }), 700);
      await sleep(2400); // evidence lands on the hypothesis
      page.__cut();
    },

    /**
     * Teams → dashboards: select two metric cards → Layers panel "Group
     * selection" → name the group → the group auto-generates a dashboard
     * (KPI tiles + combined trends) on the Dashboard page's group pill.
     */
    'teams-to-dashboards': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__node', { timeout: 30_000 });
      await sleep(4000);
      await fitView(page, 900);
      page.__start();
      await sleep(700);
      const wau = page.locator('.react-flow__node', { hasText: 'Weekly Active Users' }).first();
      const churn = page.locator('.react-flow__node', { hasText: 'Net Revenue Churn' }).first();
      await glideClick(page, wau, 650);
      await page.keyboard.down('Shift');
      await glideClick(page, churn, 550);
      await page.keyboard.up('Shift');
      await sleep(500); // two cards selected
      await glideClick(page, page.locator('button[title="Layers"]'), 650);
      await sleep(1000); // Layers panel opens
      await glideClick(page, page.getByRole('button', { name: 'Group selection' }), 650);
      await page.getByText('Name this group').waitFor({ timeout: 10_000 });
      await sleep(400);
      const nameInput = page.locator('[role="dialog"] input').first();
      await nameInput.click();
      await nameInput.press('ControlOrMeta+a');
      await typeSlow(page, 'Retention team', 45);
      await sleep(300);
      await glideClick(page, page.getByRole('button', { name: 'Create group' }), 600);
      await sleep(1700); // group frame lands on canvas + Layers focuses it
      await page.goto(`/canvas/${canvasId}/dashboard`, { waitUntil: 'domcontentloaded' });
      await sleep(2600);
      const pill = page.getByRole('button', { name: 'Retention team' }).first();
      await glideClick(page, pill, 700);
      await sleep(2800); // KPI tiles + combined charts
      page.__cut();
    },

    /**
     * Instrumentation → trust: add a Source node → configure its pipeline →
     * "Run preview" (the check) → result grid → "Save & feed downstream" —
     * the node now carries a freshness status (N points · date).
     */
    'instrumentation-to-trust': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__node', { timeout: 30_000 });
      await sleep(4000);
      await fitView(page, 900);
      page.__start();
      await sleep(900);
      await glideClick(page, page.getByRole('button', { name: 'Add Card' }), 700);
      await sleep(700);
      await glideClick(page, page.getByRole('menuitem', { name: /Source Node/ }), 700);
      await sleep(1500); // source node lands
      await glideClick(
        page,
        page.getByRole('button', { name: /Configure source/ }).first(),
        800
      );
      await sleep(1800); // config sheet opens on Generate
      await glideClick(page, page.getByRole('button', { name: /Run preview/ }), 800);
      await sleep(2600); // the check runs → result grid
      await glideClick(page, page.getByRole('button', { name: /Save & feed downstream/ }), 800);
      await sleep(2000);
      await page.keyboard.press('Escape'); // close sheet → node shows freshness
      await sleep(2200);
      page.__cut();
    },

    /**
     * Workflow orchestration: Strategy Table → assign an owner (People) →
     * open the Impact contract → Review: result note → mark "Won" →
     * "Create evidence note" — the decision is recorded.
     */
    'workflow-orchestration': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}/strategy`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Table' }).waitFor({ timeout: 30_000 });
      await sleep(2500);
      page.__start();
      await sleep(800);
      await glideClick(page, page.getByRole('button', { name: 'Table' }), 700);
      await sleep(1400);
      const row = page.locator('tr', { hasText: 'Onboarding revamp' }).first();
      // Owner: the People cell's avatar-stack popover
      await glideClick(page, row.locator('[data-slot="popover-trigger"]').first(), 750);
      await page.getByPlaceholder('Assign people…').waitFor({ timeout: 8000 });
      await sleep(600);
      await glideClick(page, page.locator('[cmdk-item]').first(), 650);
      await sleep(900); // avatar lands in the People cell
      await page.keyboard.press('Escape');
      await sleep(500);
      // Review the impact contract
      await glideClick(page, row.locator('[title="Edit impact"]').first(), 800);
      await page.getByText('Review', { exact: true }).first().waitFor({ timeout: 12_000 });
      await sleep(1200);
      const note = page.getByPlaceholder(/What happened/);
      await note.scrollIntoViewIfNeeded();
      await glideClick(page, note, 700);
      await typeSlow(page, 'Activation +4.2pp vs baseline; guardrail steady.', 30);
      await sleep(400);
      await glideClick(page, page.getByRole('button', { name: 'Won', exact: true }), 700);
      await sleep(1400); // status saved → chip goes emerald
      await glideClick(page, page.getByRole('button', { name: /Create evidence note/ }), 700);
      await sleep(2400); // decision recorded as evidence
      page.__cut();
    },

    /**
     * Strategy → impact (app-side, replaces the public-embed take): the real
     * signed-in canvas, travelling the causal trace from the onboarding bet
     * through Activation → WAU → MRR. Camera-only — pans start in the empty
     * band under the tree so no node gets dragged.
     */
    'strategy-to-impact': async (page) => {
      const { canvasId } = demoCanvas();
      await page.goto(`/canvas/${canvasId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.react-flow__node', { timeout: 30_000 });
      await sleep(4000);
      await fitView(page, 900);
      page.__start();
      await sleep(1800); // establish the whole operating map
      await zoomIn(page, 2, 550); // move in on the centre of the tree
      // Travel the trace left → right. The editor canvas rubber-band selects
      // on plain drag — Space+drag is its pan gesture.
      const spacePan = async (from, to, ms) => {
        await page.keyboard.down('Space');
        await pan(page, from, to, ms);
        await page.keyboard.up('Space');
      };
      await spacePan({ x: 640, y: 700 }, { x: 1150, y: 700 }, 1400); // to the bet
      await sleep(1000);
      await spacePan({ x: 1100, y: 700 }, { x: 700, y: 700 }, 1400); // → Activation
      await sleep(1000);
      await spacePan({ x: 1100, y: 700 }, { x: 620, y: 700 }, 1400); // → WAU
      await sleep(1000);
      await spacePan({ x: 1100, y: 700 }, { x: 560, y: 700 }, 1400); // → MRR
      await sleep(1200);
      await fitView(page, 900); // resolve back to the whole system
      await sleep(1800);
      page.__cut();
    },

    /** Pipeline smoke: sign-in worked, video + encode contract holds. */
    'smoke-home': async (page) => {
      await sleep(2500);
      await glide(page, { x: 640, y: 300 }, 900);
      await sleep(1500);
    },

    /** Diag: dump console errors + URL on prod (not a take). */
    diag: async (page) => {
      page.on('console', (m) => {
        if (m.type() === 'error') console.log('[diag][console]', m.text().slice(0, 300));
      });
      page.on('pageerror', (e) => console.log('[diag][pageerror]', String(e).slice(0, 300)));
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await sleep(6000);
      console.log('[diag] url:', page.url());
      console.log('[diag] body text head:', (await page.evaluate(() => document.body.innerText.slice(0, 200))) || '(empty)');
      await page.screenshot({ path: 'e2e/loops/diag.png' });
    },

    /** Scout: screenshot the surfaces the five loops need (not a take). */
    scout: async (page) => {
      const shot = (n) => page.screenshot({ path: `e2e/loops/scout-${n}.png` });
      await sleep(2000);
      await shot('home');
      // First canvas
      await page.locator('[data-slot="card-title"]').first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(/\/canvas\/[^/]+$/, { timeout: 20000 }).catch(() => {});
      const canvasUrl = page.url();
      console.log('[scout] canvas url:', canvasUrl);
      await sleep(6000);
      await shot('canvas');
      // Layers panel
      await page.click('button[title="Layers"]').catch(() => {});
      await sleep(1500);
      await shot('layers');
      if (/\/canvas\//.test(canvasUrl)) {
        await page.goto(canvasUrl + '/dashboard');
        await sleep(5000);
        await shot('dashboard');
        await page.goto(canvasUrl + '/assets');
        await sleep(4000);
        await shot('assets');
        await page.goto(canvasUrl + '/strategy');
        await sleep(4000);
        await shot('strategy');
        await page.goto(canvasUrl + '/evidence').catch(() => {});
        await sleep(4000);
        await shot('evidence');
      }
      // Explore examples
      await page.goto('/?view=explore');
      await sleep(3000);
      await shot('explore');
    },
  };
}
