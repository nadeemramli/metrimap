# Linear Initiatives ↔ metric-tree objectives

How the team uses Linear **Initiatives** as the top of the work hierarchy and
keeps every strategic objective tied to a **node in the metric tree**. This is an
infra/convention doc (see the Docs policy in `@AGENTS.md`); the product rationale
for the metric tree lives in the Obsidian product vault (**2.a.i Strategy and
Discovery Pipeline**).

Pairs with **[linear-setup.md](./linear-setup.md)** (the System Health bridge) —
same workspace, different Linear feature.

> **Status: LIVE (2026-07-04).** Initiatives are enabled for the Canvasm
> workspace. The first metric-anchored Initiative — **"Grow Profit — value-tree
> objective"** — is live with the growth project attached, an owner, a target
> date, and a first update posted. See _What is configured now_ below.

## Why Initiatives

Linear's hierarchy is **Initiatives → Projects → Issues**. An Initiative is the
native "promote to Linear" container for strategy: it carries an objective, an
owner, a target date, an optional doc, and a **health rollup** across its
projects. That makes it the right home for an objective — as long as the
objective is not vague prose but a **measurable node in our metric tree**.

## The convention (read before creating one)

1. **Objective = a metric-tree node.** Every strategic Initiative names a single
   node from the metric tree as its objective (ideally a `Core/Value` node, or a
   `Data/Metric` driver of one). This keeps strategy tied to the value pipeline
   instead of drifting into activity-tracking. Put the node in the Initiative
   **summary** and link it in the description: node title, `metric_cards.id`, its
   category, and the canvas it lives on.
2. **Projects are the drivers.** Attach the projects whose work is expected to
   move that node. A project can belong to more than one Initiative, so attaching
   is **additive** — it never removes a project's existing Initiative.
3. **Owner + target date are required.** No un-owned or open-ended Initiatives.
4. **Post Initiative updates**, not just project updates — the update is where the
   health call (`onTrack` / `atRisk` / `offTrack`) against the objective node
   lives.
5. **Don't duplicate the tree in Linear.** The metric tree is authored in Metrimap
   (Supabase `metric_cards`); the Initiative only *references* a node. Metrimap
   stays the source of truth for the value, Linear for the work.

## What is configured now

| Field | Value |
|---|---|
| Initiative | **Grow Profit — value-tree objective** |
| Objective node | `Profit` — `metric_cards.id = 561abd00-9879-49a7-9341-8fad51240022`, category `Core/Value` (sub `Critical Path`) |
| Lives on canvas | `SaaS — Example Metric Tree` (project `34d5c80b-5b1a-4f27-9892-2cf1a5ab6715`) |
| Owner | Nadeem Ramli |
| Target date | 2026-09-30 |
| Attached project | `Programmatic building — Metrimap MCP + API` (a growth/activation driver of Revenue → Profit) |
| First update | posted (`onTrack`) |

`Profit` is the apex `Core/Value` critical-path node; the attached growth project
drives adoption → activation → revenue → profit, so it is a genuine driver of the
objective rather than unrelated infra.

## How to add another metric-anchored Initiative

1. In Metrimap, pick the node the Initiative should move; copy its
   `metric_cards.id`, title, category, and the canvas name.
2. Linear → **Initiatives → New**. Name it for the objective. In the **summary**
   put the node + id; in the description link the canvas.
3. Set **owner** and **target date**.
4. Attach the driver **projects** (additive — existing Initiatives are kept).
5. Post the **first Initiative update** with a health call against the node.

No secrets or API keys are involved — Initiatives are configured entirely in the
Linear UI (or via the Linear API with a personal key, which never enters the
browser bundle).
