# Manual test plan — Realtime collaboration + Catalog moat

A structured two-session checklist for the collaboration and catalog/semantic-layer
work (built 2026-06→07). Run with **two browser windows signed in as two different
users on the same canvas** unless a step says otherwise. Keep **DevTools console
open in both** — the realtime layer logs `📡 canvas send/recv`, copy/paste logs
`📋`, delete logs `🗑️`.

> Legend: ✅ expected to work · ⚠️ known-broken/deferred (don't file as new bugs) ·
> 🔎 watch the console.

---

## 0. Setup / sanity

- [ ] Both windows load the same canvas without errors.
- [ ] 🔎 Each console shows `📡 canvas realtime: SUBSCRIBED (canvas <id>)`.
- [ ] Both users appear in People → "Online now".

## 1. Presence & cursors

- [ ] Each user sees the other's **live cursor** with name + per-user color.
- [ ] Cursor stays glued to the canvas position while you **pan and zoom**.
- [ ] Cursor disappears a few seconds after the other user leaves/closes the tab.
- [ ] No canvas "flicker"/constant-refresh while a teammate moves their cursor.

## 2. Live canvas sync (activated by the store consolidation, commit fc18fc4)

For each: do it in window A, confirm it appears in window B **without reload**.
🔎 A logs `📡 canvas send: <type>`, B logs `📡 canvas recv: <type>`.

- [ ] Create a **metric card** → appears in B.
- [ ] Create each **canvas node** (source, operator, chart, comment, whiteboard) → appears.
- [ ] Create each **PRD node** (Value, Action, Hypothesis, Metric) → appears.
- [ ] **Move** a node (release the drag) → moves in B. *(syncs on drag-stop, not mid-drag)*
- [ ] **Edit** a card (rename / value / config) → updates in B.
- [ ] Edit a **source/operator/chart** config → updates in B.
- [ ] **Delete** a node → disappears in B.
- [ ] Create a **relationship edge** → appears in B. *(this was the main "doesn't sync" bug — verify it now works)*
- [ ] **Edit** a relationship (type/weight in the Relationship sheet) → updates in B.
- [ ] **Delete** a relationship → disappears in B.
- [ ] Create/delete an **operator-pipeline edge** (source→operator→chart) → syncs in B.
- [ ] **Freehand drawing** → appears in B (and doesn't shrink/jump on finish).
- [ ] **Reload both** → final state matches (DB is source of truth; conflicts are last-write-wins).
- [ ] **Undo** in A reverts only A's own action, not B's.
- [ ] ⚠️ Not synced by design (skip): groups, evidence nodes, mid-drag streaming.
- [ ] ⚠️ Known issue "one step behind" for some updates — see
      `docs/backlog/realtime-sync-one-step-behind.md`. Note if better/worse.

## 3. Copy / duplicate / delete (single session is fine)

- [ ] Select a node → **Ctrl+C** then **Ctrl+V** → a copy appears, offset from original.
- [ ] Select a node → **Duplicate** button (bottom selection panel) → copy appears.
- [ ] Repeated paste cascades (each further offset).
- [ ] **Delete** a node (Delete key, selection-panel Delete, and the card's own
      delete) → it's gone **and stays gone after refresh**.
- [ ] Delete a freehand drawing → gone after refresh.

## 4. Catalog / semantic layer (single source of truth)

Prereq: promote a card to a Tracked Metric (card settings → "Catalog this metric",
or Data hub → Candidates → promote).

- [ ] **Place from catalog** on canvas B (Add from catalog / picker) → new card shows
      the metric's name + series.
- [ ] Same metric on canvas A and canvas B shows the **same values** after (re)load.
- [ ] **Paste-as-reference**: duplicate a catalogued card → the copy stays **linked**
      to the same metric. Verify via Data hub → the metric's **"Where is this used?"**
      lineage lists both cards.
- [ ] **Value write-through**: edit a catalogued card's data on canvas A → reopen
      canvas B → B shows the new values (shared `metric_values` store).
- [ ] **Definition sharing**: a referenced card's **title + formula** come from the
      catalog on load (renaming the card locally is overwritten on reload — catalog
      is authoritative, by design).
- [ ] **Catalog-edit push-down**: edit the metric's name/formula in the Data hub →
      referencing cards on the **currently open** canvas update immediately; other
      canvases update on their next load.

## 5. Members / sharing

- [ ] Invite a collaborator by email (they must already have an account).
- [ ] Change a collaborator's role / remove them.
- [ ] Public toggle ON → **Copy link** gives an `/embed/...` URL that opens
      **read-only without login**.
- [ ] ⚠️ Embed view renders nodes/relationships imperfectly — see
      `docs/backlog/public-embed-rendering.md`.

## 6. Comments / mentions / notifications

- [ ] Post a comment in the right-side panel → shows in the panel; resolve a thread.
- [ ] Card **Discussion** tab comments post and list.
- [ ] ⚠️ Panel comment does **not** appear on the canvas comment node (independent
      threads — known).
- [ ] ⚠️ A comment typed on a comment **node** disappears on reload (threadId not
      persisted — known).
- [ ] ⚠️ Comments don't sync live between sessions (only notifications do — known).
- [ ] ⚠️ @mention usually only offers yourself (collaborators not seeded — known).
- [ ] Once a teammate is an invited collaborator: `@` in the panel composer offers
      them → mention creates a **notification** (inbox + `/feed`) in real time.

---

## If something fails
Capture the two consoles' `📡/📋/🗑️` lines and any red error toast. For sync:
`send` but no `recv` = delivery; `recv` but no visual change = apply/render;
`NOT sent` = channel timing. See `docs/backlog/realtime-sync-one-step-behind.md`.
