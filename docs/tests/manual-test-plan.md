# Manual test plan — everything built (correctness → collaboration → catalog)

One consolidated checklist for all the work shipped 2026-06→07: the correctness
slice, copy/duplicate/delete, realtime collaboration + cursors, the store
consolidation, and the catalog/semantic-layer moat. Run top-to-bottom in one
session.

**Setup:** most collaboration steps need **two browser windows signed in as two
different users on the same canvas**; single-session steps are marked *(solo)*.
Keep **DevTools console open in both** — the app logs `📡 canvas send/recv`
(realtime), `📋` (copy/paste), `🗑️` (delete).

> Legend: ✅ should work · ⚠️ known-broken/deferred (don't file as new bugs) ·
> 🔎 watch the console.

---

## 1. Correctness slice *(solo)*

### 1a. DAG / cycle validation on connect
- [ ] Connect A→B (relationship or data-flow edge), then try to drag B→A to close
      a loop. The connection is **refused** (can't drop it / no edge created).
- [ ] Try a longer loop: A→B→C, then C→A → refused.
- [ ] A valid forward/branch connection (A→B→C, add A→C) still works.
- [ ] Evidence/metadata/comment (reference) edges may still form loops — that's intended.

### 1b. Source stale-on-disconnect
- [ ] Wire a **source node** to a warehouse connection (Data hub) and Run it so it
      shows a series.
- [ ] Delete that connection in the Data hub, then reload the canvas.
- [ ] The source node keeps its **last values** and shows an amber
      "Disconnected — showing last value" badge (never zeroes/blanks).

### 1c. Freehand *(already verified — re-confirm)*
- [ ] Draw with the freehand tool → stroke has variable width, no shrink/jump on
      finish, and survives reload.

## 2. Copy / duplicate / delete *(solo)*

- [ ] Select a node → **Ctrl+C** then **Ctrl+V** → a copy appears, offset.
- [ ] Select a node → **Duplicate** (bottom selection panel) → copy appears.
- [ ] Repeated paste cascades (each further offset).
- [ ] Works for every family: metric card, PRD node (Value/Action/Hypothesis/
      Metric), and canvas node (source/operator/chart/comment/whiteboard).
- [ ] **Delete** via each path — Delete key, selection-panel Delete, and the
      card's own delete button — removes the node **and it stays gone after refresh**.
- [ ] Delete a freehand drawing → gone after refresh.
- [ ] Empty selection + copy/duplicate shows a "select a node first" hint (no silent no-op).

## 3. Presence & cursors

- [ ] Both users appear in People → "Online now".
- [ ] Each sees the other's **live cursor** with name + per-user color.
- [ ] Cursor stays glued to canvas position while you **pan and zoom**.
- [ ] Cursor disappears a few seconds after the other leaves/closes the tab.
- [ ] No canvas flicker/"constant refresh" while a teammate's cursor moves.

## 4. Live canvas sync

For each: do it in window A, confirm it appears in window B **without reload**.
🔎 A logs `📡 canvas send: <type>`, B logs `📡 canvas recv: <type>`.

- [ ] Create a **metric card** → appears in B.
- [ ] Create each **canvas node** (source, operator, chart, comment, whiteboard).
- [ ] Create each **PRD node** (Value, Action, Hypothesis, Metric).
- [ ] **Move** a node (release the drag) → moves in B. *(on drag-stop, not mid-drag)*
- [ ] **Edit** a card (rename / value / config) → updates in B.
- [ ] Edit a **source/operator/chart** config → updates in B.
- [ ] **Delete** a node → disappears in B.
- [ ] Create a **relationship edge** → appears in B. *(newly activated by the store
      consolidation — this was the "relationship doesn't sync" bug; verify closely.)*
- [ ] **Edit** a relationship (type/weight in the sheet) → updates in B. *(also newly activated.)*
- [ ] **Delete** a relationship → disappears in B.
- [ ] Create/delete an **operator-pipeline edge** (source→operator→chart) → syncs.
- [ ] **Freehand drawing** → appears in B.
- [ ] **Reload both** → final state matches (DB is source of truth; last-write-wins).
- [ ] **Undo** in A reverts only A's own action, not B's.
- [ ] ⚠️ Not synced by design (skip): groups, evidence nodes, mid-drag streaming.
- [ ] ⚠️ Known "one step behind" for some updates — see
      `docs/backlog/realtime-sync-one-step-behind.md`. Note if better/worse now.

## 5. Catalog / semantic layer (single source of truth)

Prereq: promote a card to a Tracked Metric (card settings → "Catalog this metric",
or Data hub → Candidates → promote).

- [ ] **Place from catalog** on canvas B → new card shows the metric's name + series.
- [ ] The same metric on canvas A and B shows the **same values** after (re)load.
- [ ] **Paste-as-reference**: duplicate a catalogued card → the copy stays **linked**.
      Verify via Data hub → the metric's **"Where is this used?"** lineage lists both.
- [ ] **Value write-through**: edit a catalogued card's data on A → reopen B → B shows
      the new values (shared `metric_values`). *(write-through newly activated by consolidation.)*
- [ ] **Definition sharing**: a referenced card's **title + formula** come from the
      catalog on load (a local rename is overwritten on reload — catalog is authoritative).
- [ ] **Catalog-edit push-down**: edit the metric's name/formula in the Data hub →
      referencing cards on the **open** canvas update immediately; others on next load.
- [ ] **Linked badge**: a referenced card shows a green "Tracked" badge (tooltip explains it).
- [ ] **Detach**: card settings → "Detach" (next to "In Metric Catalog") → card keeps
      its current values, badge clears; after reload it no longer follows catalog edits
      (independent fork) and lineage no longer lists it.

## 6. Members / sharing

- [ ] Invite a collaborator by email (they must already have an account).
- [ ] Change a collaborator's role / remove them.
- [ ] Public toggle ON → **Copy link** gives an `/embed/...` URL that opens
      **read-only without login**; private → link is `/canvas/...` (login required).
- [ ] ⚠️ Embed view renders nodes/relationships imperfectly — see
      `docs/backlog/public-embed-rendering.md`.

## 7. Comments / mentions / notifications

- [ ] Post a comment in the right-side panel → shows in the panel; resolve a thread.
- [ ] Card **Discussion** tab comments post and list.
- [ ] **Comment node persistence** *(fixed)*: type a comment on a canvas comment
      node → **reload** → the comment is still there (threadId now persisted).
- [ ] **Live comment sync** *(new)*: two sessions — a comment posted in A on a
      thread/node appears in B **without reload** (comment node + panel's open
      thread both subscribe live).
- [ ] **Mentionable teammates** *(fixed)*: with a teammate present on the canvas,
      `@` in the panel composer now offers **them** (not just yourself) — sourced
      from the live presence roster + invited collaborators. Mention creates a
      **notification** (inbox + `/feed`) in real time.
- [ ] **Last edited by X** *(new)*: edit a metric card → its footer shows
      "Edited <time> by <name>" ("by you" for your own edits; a teammate's name
      for theirs). Server-stamped, so it reflects who actually made the change.
- [ ] ⚠️ Panel comment still doesn't appear on the canvas comment node — they're
      independent threads (a general panel comment isn't node-scoped). Known.

## 8. Templates *(solo)*

- [ ] New project → template picker → "Starter examples" lists **8 trees**: SaaS,
      E-commerce, Retail, **Web Analytics, Company KPIs, Marketing KPIs, Feature
      Launch, Lifecycle Cohort Analysis**.
- [ ] Pick one of the new trees → it deep-copies into your workspace and opens;
      nodes, groups, relationships, and the source→operator→chart showcase render.
- [ ] "Run Simulation" on the copied tree recomputes the projection (operators work).

## 9. Update feed *(mostly solo; one two-session check)*

- [ ] `/feed` (Activity) lists people-events (mentions/comments) + system-events
      (created/updated) merged, newest first.
- [ ] Tabs filter: All activity / Mentioned me / Bookmarked.
- [ ] **Bookmark** an item → switch to Bookmarked tab shows it → **reload** → still
      there (now DB-backed, not localStorage). Un-bookmark removes it.
- [ ] **Live** *(two sessions / two devices)*: get @mentioned in A → the feed in B
      gains the item **without reload** (subscribes to notification inserts).
- [ ] Bookmarks persist across devices (same account, different browser).

---

## If something fails
Capture the two consoles' `📡/📋/🗑️` lines and any red error toast. For sync:
`send` but no `recv` = delivery; `recv` but no visual change = apply/render;
`NOT sent` = channel timing. See `docs/backlog/realtime-sync-one-step-behind.md`.

## Deferred items tracked in backlog (not expected to pass)
- `docs/backlog/realtime-sync-one-step-behind.md` — update propagation lag.
- `docs/backlog/public-embed-rendering.md` — embed rendering fidelity.
- "Last edited by X" per-node attribution — collab polish, not built yet.
