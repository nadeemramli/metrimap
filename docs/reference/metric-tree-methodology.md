# Metric Tree Methodology (reference)

> **What this is.** A faithful synthesis of the external methodology Metrimap draws inspiration from — the Levers Labs essays and Abe Gong's "Designing & Building Metric Trees" talk. It is the **principle**, not the product spec.
>
> **What this is NOT.** It is not a description of how Metrimap works, nor a backlog. **Our app deliberately has its own approach** and may diverge from this methodology in concept, vocabulary, and UX. Where we diverge, the decision is recorded in [§ Our approach](#our-approach-where-metrimap-diverges) — and that section is the source of truth for *us*, this reference is the source of truth for *the principle*.
>
> **Sources.** Levers Labs: [Introducing Metric Trees](https://www.leverslabs.com/article/introducing-metric-trees), [Designing Metric Trees](https://www.leverslabs.com/article/designing-metric-trees), [Metric Tree Design Patterns](https://www.leverslabs.com/article/metric-tree-design-patterns), [Root Cause Analysis with Metric Trees](https://www.leverslabs.com/article/root-cause-analysis-with-metric-trees), [Five Causal Factors of Metric Drift](https://www.leverslabs.com/article/five-causal-factors-of-metric-drift); plus the conference talk transcript (on file).

---

## 1. The thesis

Every organization is a system that turns **inputs** (physical, human, intellectual capital) into **outputs** (predominantly cash). That transformation is a **function** — and a function implies a **formula**. A company's unique "fingerprint" is its **fundamental formula**: how *it* converts inputs to outputs.

A **growth model** is that formula *reified* — made trackable, engageable, and interactable over time. A **metric tree** is the **logical representation** of the growth model (conceptual → logical → physical; the tree is the logical layer).

The author's framing of the **data-team mandate**: *help the company define, understand, evolve, and operationalize its growth model.* Data's job is to **identify levers**; operators' job is to **pull** them. The four questions all of this exists to answer, at low latency / low friction / high frequency:
1. What happened? (descriptive)
2. Why did it happen? (diagnostic)
3. What will happen next? (predictive)
4. What should we do about it? (prescriptive)

## 2. Anatomy of a tree

A tree is a **graph of nodes (metrics) and edges (relationships)** with three ingredients:

- **Metrics** — business facts about how value is created, captured, transferred, or lost. A metric is only as useful as the clarity of its definition and consensus on its importance. Metrics live in **dimensional context** (time, entities).
- **Relationships** — edges tying metrics together.
- **Weights** — the significance of a relationship to the output.

### North Stars
The top-most metrics, *"from which all other metrics derive their legitimacy."* If a metric doesn't point at a North Star, it's illegitimate. Three types:
- **Customer value** — denominated in the footprint of value delivered (e.g. prompts successfully returned, dashboards viewed, nights booked). "Take care of customer value and the score takes care of itself."
- **Financial** — the score itself; P&L realities (capital in/out).
- **Strategic** — steps that define *why we win* (moats, network effects, market expansion). Rarer, because most companies aren't strategic.

Multiple North Stars are allowed; prioritize one. They evolve as the business matures.

### Two kinds of input — the key distinction
- **Components** (decomposition layer) — **mathematical identities**, true *by definition*. `Revenue = Customers × ASP`; `Customers = Leads × Win Rate`; `CAC = (Sales + SDR + Marketing Spend) / New Customers`. They define the tree's skeleton via algebraic factoring. Recurse until you exhaust the **metric vocabulary**; what remains are **leaf metrics**.
- **Influences** (action layer) — **contingent relationships**: empirically derived, temporally contingent, *not* true by definition (e.g. *speed-to-lead → win rate*). They are the **operational levers** worth testing. May be known relationships *or* pure hypotheses. Influences should be **dynamic/moveable** to be worth measuring.

### Metadata
- On **edges**: **Strength** (magnitude of impact) and **Confidence** (certainty the relationship holds).
- On **nodes**: **Slices / dimensions** — the X/Y/Z you'd reason about a metric by (e.g. win rate *by region, by segment*).

## 3. The four-step design process
1. **Define North Star(s).** (Trees in the wild usually start with dollars.)
2. **Recursively decompose into components** (mathematical identities) until you hit leaf metrics.
3. **Layer on influences** (empirical levers / hypotheses) and hang them on the tree.
4. **Add metadata** — strength + confidence on edges, slices on nodes.

Guiding principle: *design choices should expose the **most actionable levers**.*

## 4. Design patterns
1. **Conversion Rates** — quantity × quality tradeoff; compute the rate *from* the output (each input is its own collection of levers).
2. **Funnels** — chained conversions modeling multi-step processes / handoffs; makes each step's impact explicit and comparable.
3. **Growth Loops** — output feeds back as its own input (referrals, virality, profit reinvestment); "the most powerful mechanism of growth."
4. **Influence Metrics** — the fulcrum between performance metrics and efforts to improve them; empirical, not mathematical; a framework for experimentation.
5. **Components vs. Slices** — a *decision*: use **components** when quantities have distinct owners / different subtrees; use **slices** when subdividing for analysis without changing ownership.

## 5. Diagnosis & prediction
- **Root cause analysis = traverse *down* the tree.** "Five Whys" drill-down. Because any deviation in an output is a function of input shift or dimensional shift, RCA is automatable *if* the dimensions and relationships were specified up front. Causation cannot be inferred from statistics alone — the tree supplies the semantic/causal structure that rejects spurious correlations.
- **Forecasting = traverse *up* the tree.** Take inputs, understand drivers, simulate changes, propagate upward.

### The five causal factors of metric drift
1. **Component Drift** — a defining input changed (deterministic). Decompose and isolate which factor moved.
2. **Temporal Variance** — natural/cyclic behavior (seasonality, quarterly cycles, weekly patterns). Compare to equivalent historical periods.
3. **Influence Drift** — an influence's *value* **or** its *coefficient* (relationship strength) changed. Track both.
4. **Dimension Drift** ("mix shift") — composition of slices changed (within-slice change, mix change, or slice add/remove). E.g. mobile share rose 50%→70% and converts lower, diluting the blend.
5. **Event Shocks** — abrupt external/internal events (GTM, Operations, Market, Product). Correlate timing to specific events.

Drift is usually **multiple factors at once**; durable remediation addresses the collection, not a single cause.

## 6. Applications (why it's "transformational")
Onboarding (transfer tacit domain context fast), knowledge repo (shelve every analysis/experiment *behind* a node/edge), data-team mission ("turn dashed lines solid; light up the tree with levers"), dashboard rationalization (partition dashboards by limbs of the tree), business reviews ("only drill on the reds"), automated RCA, and forecasting.

## 7. SOMA (context, not a dependency)
Abe's open-source **Standard Operating Metrics & Analytics**: businesses aren't snowflakes — ~90% of metrics standardize by **business model** (B2B SaaS, B2C, e-commerce, marketplace). SOMA aims to ship a spanning set of metrics per model (~250 for B2B SaaS) with metadata + relationships, and to auto-generate metrics via dbt from an **activity/event ledger** (model the business as a ledger of things customers/company do, not as tables). Noted here only as the methodology's broader context.

---

## Our approach (where Metrimap diverges)

> **TBD — to be co-authored through discussion, not auto-generated.** This section records *intentional* differences between the methodology above and how Metrimap actually works. Until a row is filled in deliberately, assume nothing here.

| Methodology concept | Metrimap's stance | Rationale |
|---|---|---|
| _(to discuss)_ | | |

Open questions we are deliberately holding (see chat): relationship taxonomy (our deterministic/probabilistic/causal/compositional typing vs. the components/influences split), how/whether we adopt strength+confidence, whether we lean into automated RCA & the five drift factors as features, and whether SOMA-style standard libraries fit our product.
