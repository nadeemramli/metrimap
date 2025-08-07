# Metrimap

This document outlines the information architecture for the Metrimap tool, a visual-first application for building, managing, and analyzing sophisticated **metric trees** and **business architecture mapping**.

It provides a canvas for users to visually map components of their business and relationships within them. Using Metrimap user able to create cards and connect them, all inside the canvas, the cards then be assign whether it's a business process, or a metrics to be track, or a work/action, or anything stated in our **Card Category.** The tool enables the construction of a comprehensive model where a value chain can act as the spine, and its components **(metrics, actions, hypotheses) are enriched with properties** and explicitly **defined relationships.**

## 1. Core Functionality & Canvas

Metrimap application organized its features into two main categories: functions that exist outside the primary editing canvas ("**Beyond Canvas**") and functions that operate directly within it ("**Within Canvas**"). 

Essentially, the application's core is a dynamic canvas powered by `react-flow`, designed as an interactive workspace for users to build, navigate, and analyze their business architecture. This canvas is not a static drawing board; it is the environment where a company's "fundamental formula"—the unique way it translates inputs into value—is made visible and tractable.
- **Within Canvas:** 
	- **Node Creation:** Users can populate the canvas by creating **Metric Cards**. These cards are the fundamental building blocks of the model, representing every component of the business system—from high-level `North Star` metrics to granular `Work/Action` items like experiments and initiatives. The process of adding nodes is the first step in translating abstract business concepts into a structured, logical model.
	- **Node Connectivity:** Users can draw directed edges (arrows) between nodes to create **Relationships**. This is a critical function, as these connections represent the logic of the business model. Each edge explicitly defines the relationship between two cards (e.g. `Causal`, `Deterministic`,`Probabilistic`, `Compositional`), turning the canvas from a collection of ideas into a coherent, causal map that can be analyzed and validated.
	- **Interactive Navigation & Manipulation:** The canvas supports fluid interaction to manage complexity:
	    - **Pan & Zoom:** Standard mouse and trackpad controls allow for seamless navigation across large and intricate metric trees, from a high-level overview to a detailed view of a specific "limb" of the map.
	    - **Multi-Select:** Users can select multiple nodes and edges at once to move, delete, or group them, enabling efficient organization and refactoring of the model.
	- **State Management & Persistence:** The canvas is designed as a persistent workspace.
	    - **Auto-Save:** All aspects of the canvas state—including the position, content, and data of every node, and the structure and properties of every relationship—are continuously saved.
	    - **Project Integrity:** This ensures that the user's complex model is preserved between sessions, allowing for iterative development and long-term analysis without loss of work. The canvas becomes a living document that evolves with the business.

### **Part I: "Beyond Canvas" Functions**

These features constitute the application's shell, providing project management, navigation, and high-level reporting capabilities.
#### **1. Homepage**
- The central hub or "mission control" where users manage all their canvas projects.
- Displays each canvas as a card with key metadata: Name, Description, Tags, Last Modified Date, and Collaborators.
- Provides core actions to create a new canvas or to search/filter existing ones.
#### **2. Application Navigation (Sidebar)**
- A persistent, icon-driven sidebar that appears once a user enters a canvas.
- Provides access to all major pages/views for the selected canvas project.
#### **3. Dashboard Page**
- The primary consumption layer, designed for business reviews and performance monitoring.
- Dashboards are dynamically generated from the **"Subflow"** or **"Group"** nodes created on the canvas, ensuring a direct link between the business model's structure and its reporting.
- A dropdown allows users to select which Subflow-based dashboard to view. The dashboard displays the live, interactive Metric Cards from that group.
#### **4. Assets Page (Knowledge Repository)**
- A centralized, table-based view of all components within a canvas, allowing for powerful searching and management.
- It is divided into three tabs:
    - **Metrics (Nodes):** A table of all Metric Cards and their properties.
    - **Relationships (Edges):** A table of all connections, detailing their type, confidence, and evidence count.
    - **Repo:** A master log of all attached evidence (experiments, analyses, notebooks) and events from across the entire canvas.
#### **5. Source Page (Data Governance)**
- A specialized, technical view for managing the data instrumentation pipeline.
- Lists all `Data/Metric` cards and provides fields to track their underlying `Source System`, `Event Name`, `Actor`, `Trigger`, and `Instrumentation Status`.

#### **6. Canvas Settings Page**
- Manages the project-level settings for the current canvas.
- Includes tabs for:
    - **General:** Edit canvas Name, Description, and organizational Labels.
    - **Data:** A master table view of all cards for quick editing access.
    - **Canvas Changelog:** An immutable, reverse-chronological timeline that automatically tracks all significant changes made to the canvas, providing a full audit trail.

### **Part II: "Within Canvas" Functions**

These features are the core tools for building, editing, and analyzing the metric tree directly on the visual canvas.
#### **1. Core Canvas Functionality**
- An interactive canvas powered by `react-flow` that allows for node creation, directed edge connectivity, and pan/zoom navigation.
- The canvas state is persistently saved, ensuring the model is a living, evolving document.
#### **2. The Metric Card (Node Component)**
- The fundamental building block of the map, with dynamic views based on its assigned `Category`.
- Attributes include a Title, Description, a two-layer Category system, user-defined Tags, and optional Causal Factors.
- `Data/Metric` cards have a special view to display quantitative time-series data and trend indicators.
- Includes a hidden "Dimensions" table that can be expanded to classify the metric's properties.
#### **3. The Card Settings (Sheet View)**
- A comprehensive, tab-based side panel for detailed configuration of each Metric Card.
- Tabs include **Details** (chart options), **Source** (defining data as Manual, Calculated, or Random), **Data** (spreadsheet view), **Events** (timeline annotations), **Key Results** (OKRs), **Correlations**, **Comments**, and **Setting** (metadata).
#### **4. The Relationship (Connecting Component)**
- The directed edge between cards, featuring dynamic visuals based on its properties.
- Line style indicates **Confidence Level** (solid for high, dashed for medium, dotted for low).
- Line color indicates **Relationship Type** (e.g., green/red for positive/negative correlations, orange for causal claims).
- Features a **Relationship Sheet (Knowledge Hub)** to attach supporting evidence (analyses, experiments), turning each connection into a repository of institutional knowledge.
#### **5. Canvas Built-in Functions**
- **Grouping/Subflows:** Allows users to group nodes into named containers that provide visual context and power the Dashboard page.
- **Auto-Layout:** Uses the Dagre library to automatically arrange the metric tree in a clean, hierarchical layout.
- **Node Toolbar:** A contextual toolbar for quick actions like Edit, Copy, Collapse, and Delete.
- **Canvas Controls:** A global control panel for zoom functions and a centralized **Date Range Picker** that filters data across all metric cards on the canvas simultaneously.

# Beyond Canvas

## 2. The Homepage: Mission Control

The homepage is the first screen users see and serves as the central hub for all their Metrimap projects. It is designed for organization and quick access.
- **Purpose**: Managing canvases
- **Layout:** A clean, gallery-based grid (show canvas inside for thumbnail) or list view. Each card represents a **Canvas Project**.
- **Canvas Card Content:** Each card on the homepage will display key metadata about the canvas it represents:
    - **Canvas Name:** The primary title of the project (e.g., "SaaSCo Q3 Growth Model").
    - **Description:** A short, one-line summary of the canvas's purpose.
    - **Labels/Tags:** The organizational tags assigned in the canvas settings (e.g., "Marketing," "Finance," "In Progress").
    - **Last Modified Date:** To easily find the most recently worked-on projects.
    - **Team Members/Avatars:** Shows which users are collaborating on that canvas.
- **Core Actions:**
    - **"New Canvas" Button:** The primary call-to-action, allowing users to create a new, blank canvas project.
    - **Search and Filter:** Users can search for canvases by name or filter them by the assigned labels/tags.
- **Interaction:** Clicking on a canvas card navigates the user into the main Metrimap interface for that specific project, at which point the application sidebar appears.


## 3. Application Navigation: The Sidebar (Within Canvas)

There's no sidebar during the home page. Sidebar appears when user open/in a canvas. Once a user selects and enters a specific canvas from the homepage, a persistent sidebar appears on the left, providing access to all the different views and tools for that canvas.
### 3.1. Sidebar Components
- **Sidebar Design:**
	-  **UI:** A simple, icon-driven sidebar, designed to be collapsible to maximize canvas space. Can't be expand (no need for expand).
	- **Behavior:** Fixed
- **Home Icon:**
    - **Function:** Navigates the user back to the homepage where all their canvases are listed.
    - **Behavior:** When on the homepage, the sidebar is not visible.
- **Canvas Icon:**
    - **Function:** The default view. Shows the main canvas for building and editing the metric tree.
- **Dashboard Icon:**
    - **Function:** Navigates to the **Dashboard Page** described above.
- **Assets Icon:**
    - **Function:** Navigates to a centralized repository for all the elements within the current canvas, presented in a filterable, sortable table view. This is the "database" view of the map.
    - **Sub-Views (Tabs within the Assets page):**
        - **Metrics (Nodes):** A table of all Metric Cards, with columns for Title, Category, Owner, etc. Allows for bulk editing and management.
        - **Relationships (Edges):** A table listing every connection, with columns for Source Node, Target Node, Relationship Type, and Confidence Level.
        - **Repo:** A master table of all attached **Evidence Items** (from the Relationship Sheets) and **Events** (from the Card Settings), allowing users to browse all experiments, analyses, and notebooks in one place.
- **Source Icon:**
    - **Function:** Navigates to a dedicated data governance and instrumentation view. This is where the connection to the underlying data systems is managed.
    - **UI:** A table listing all `Data/Metric` cards.
    - **Columns/Features:** `Source System`, `Activity/Trigger`, `Event Tracking Plan`, `Actor` (e.g., Visitor, System), and a `Checklist` column (e.g., Tracked: Yes/No) to manage the instrumentation status.
- **Canvas Setting Icon (at the bottom):**
    - **Function:** Opens the settings page for the entire canvas project.


## 4. Application Navigation Architecture/Pages/Routing within Sidebar

### 4.1. Canvas Route
This will route to Canvas 

### 4.2. The Dashboard Page
This page serves as the primary consumption layer for the metric tree, transforming analytical structures into operational business review tools.

- **Access:** Via the "Dashboard" icon in the main application sidebar.
- **Core Functionality:**
    - **Dashboard Selector:** A dropdown menu, located in the top-left corner of the page, allows users to select which dashboard to view.
    - **Dynamic Population:** The options in the dropdown are automatically populated from the names of the **Group/Subflow** nodes created on the canvas. Selecting a name (e.g., "Customer Acquisition Funnel") renders its corresponding dashboard.
    - **Dashboard Layout:** The dashboard displays all the Metric Cards from the selected Subflow. The cards are arranged in a grid or a user-configurable layout.
    - **Card Consistency:** The cards displayed on the dashboard are the _exact same_ Metric Card components from the canvas, retaining all their data, visual indicators (trends), and interactivity.
- **Strategic Alignment (Business Reviews):**
    - This feature directly enables a more effective business review process.
    - Teams can anchor their review on a specific dashboard (e.g., "Q3 Growth Initiatives").
    - They can immediately identify which metrics are "red" (underperforming) and use the interconnected nature of the map to "drill on the reds," investigating the upstream drivers and downstream impacts without leaving the Metrimap ecosystem.


### 4.3. The Assets Page: The Knowledge Repository
The **Assets** page is the central "library" for the current canvas. It detaches the components from their visual layout and presents them in a structured, data-centric view, allowing for powerful searching, sorting, and management.
- **Purpose:** To provide a comprehensive, searchable inventory of all analytical work and its constituent parts. It answers the question, "Show me everything we know and have done for this model."
- **UI:** A full-page view with three distinct tabs: **Metrics (Nodes)**, **Relationships (Edges)**, and **Repo**.

#### 4.3.a. Metrics (Nodes) Tab
- **View:** A detailed table of every card created on the canvas.
- **Columns:**
    - `Card Title`
    - `Category` (e.g., Data/Metric, Work/Action)
    - `Sub-Category` (e.g., Leading KPI, Experiment)
    - `Owner/Assignee`
    - `Creation Date`
    - `Last Updated`
    - `# of Connections`
    - `Tags`
- **Functionality:**
    - **Sorting & Filtering:** Users can sort by any column and filter by category, owner, or tags.
    - **Bulk Actions:** Potentially allows for selecting multiple cards to apply a tag or assign an owner at once.
    - **Drill-down:** Clicking on a row opens the **Card Settings Sheet** for that specific metric.

#### 4.3.b. Relationships (Edges)**
- **View:** A table of every connection on the canvas, detailing the link between two concepts.
- **Columns:**
    - `Source Node`
    - `Target Node`
    - `Relationship Type` (Causal, Deterministic, etc.)
    - `Confidence Level` (High, Medium, Low)
    - `Weight/Value` (The numerical value, like a correlation coefficient)
    - `Evidence Count` (The number of attached evidence items)
- **Functionality:**
    - Allows users to quickly see all relationships of a certain type or confidence level.
    - Clicking a row opens the **Relationship Sheet (Knowledge Hub)** for that specific connection.

#### 4.3.c Repo Tab
- **View:** A master table that aggregates all **Evidence Items** and **Events** from across the entire canvas. This is the ultimate log of all analytical and operational activity.
- **Columns:**
    - `Title` (of the evidence/event)
    - `Type` (Experiment, Analysis, Event Shock, etc.)
    - `Date`
    - `Owner/Author`
    - `Associated Metric/Relationship` (A link back to the card or edge it belongs to)
    - `Link` (URL to the source artifact)
- **Functionality:** This allows a manager or analyst to ask questions like, "Show me every A/B test we ran in Q2" or "Find all analyses related to user churn," regardless of where they are on the visual map.

### 4.4. The Source Page: Data Governance & Instrumentation

The **Source** page is a specialized, technical view focused on the "first mile" of the data journey: ensuring data is being collected correctly. It acts as a bridge between the conceptual metric and the underlying event tracking system.
- **Purpose:** To manage the instrumentation plan and data governance for all metrics. It answers the question, "For this metric to work, what data do we need, and have we actually tracked it?"
- **UI:** A master table listing every `Data/Metric` card.
- **Columns:**
    - `Metric Name`
    - `Source System`: Where the data originates (e.g., Segment, Mixpanel, Database).
    - `Event Name`: The specific tracked event that powers the metric (e.g., `user_signed_up`).
    - `Actor`: Who performs the action (e.g., `User`, `System`, `Marketing Campaign`).
    - `Trigger`: The action that fires the event (e.g., `clicks_signup_button`).
    - **`Instrumentation Status` (Checklist):** A critical column with statuses like `Planned`, `Instrumented`, `Needs QA`, `Live`. This turns the page into an active project management tool for the data engineering or analytics team.

### 4.5. Canvas Settings Page

This page manages the metadata and data for the entire canvas project.

- **General Tab:**
    - **Name:** The name of the canvas project.
    - **Description:** A high-level description of the canvas's purpose.
    - **Label:** Tags for organizing canvases on the homepage.
- **Data Tab:**
    - **UI:** A master table view showing all cards within the canvas and their key data points, allowing for quick access to Card Settings. 
    - **Interactivity:** Clicking on any row in this table will open the **Card Settings Sheet** for that specific card, allowing for quick, targeted edits without having to find the card on the visual canvas.
- **Canvas Changelog
	- ****Purpose:** To provide a complete, immutable audit trail of all significant changes made to the canvas structure and content. This is crucial for collaboration and for understanding how the model has evolved over time.
	- **UI:** A reverse-chronological timeline view.
	- **Tracked Events:** The changelog automatically records entries for actions such as:
	    - `User A` **created** card `New User Signups`
	    - `User B` **deleted** relationship from `Ad Spend` to `New User Signups`
	    - `User A` **changed confidence** on relationship `Speed to Lead -> Win Rate` from `Low` to `Medium`
	    - `User C` **updated the formula** for card `LTV`
	    - `User B` **created** the subflow group `Retention Analysis`
	- **Functionality:** Each entry in the timeline is timestamped and attributed to a user, providing full transparency and accountability for the model's evolution.


# Within Canvas

## 5. Node Component: The Metric Card

The fundamental building block of a Metrimap is the **Metric Card**. The card's structure and displayed information are dynamic, changing based on the card's assigned `Category`.
### 5.1. Card Views
- **A. Base Card Structure:** The default view for all non-`Data/Metric` cards. It contains the core attributes and actions.
- **B. "Data/Metric" Card View:** An enhanced view activated when the `Data/Metric` category is selected. It prominently displays quantitative data and trend indicators.

#### 5.1.a. Card Attributes
- **Icon**
	- **Generation:** Randomly generated upon card creation to provide quick visual distinction.
- **Title**
    - **Type:** `string`
    - **UI:** Editable text field.
    - **Purpose:** The primary identifier for the node (e.g., "Monthly Recurring Revenue," "New User Signups").
- **Description**
    - **Type:** `string`
    - **UI:** Text area for more detailed notes.
    - **Purpose:** To provide context, definitions, or formulas related to the node.
    - Code example:
        - `interface MetricValue {` 
          `period: string; // "Past 7 days" value: number; change_percent: number; trend: 'up' | 'down' | 'neutral'; }`
- **Data & Values (conditional: for data/metric cards)**
	- **Purpose:** To hold and display the quantitative data for the metric.
	- **Data Structure:** An array of objects, where each object represents a time period.
	- **UI:** Displayed prominently on the card as shown in the image.
- **Category (Two-Layer System)**
    - **Purpose:** To structurally define the node's role within the metrics tree, aligning with the systematic process.
    - **UI:** A cascading dropdown menu system.
    - **Layer 1 Options:**
        - **`Core/Value`**: Represents the foundational elements of the value delivery process.
        - **`Data/Metric`**: Represents the quantifiable measures of the business.
        - **`Work/Action`**: Represents the activities and initiatives undertaken by the business.
        - **`Ideas/Hypothesis`**: Represents assumptions, questions, or potential drivers.
        - **`Metadata`**: Represents supplementary information about the system.
    - **Layer 2 Options (Conditional on Layer 1):**
        - If `Core/Value`: `Journey Step`, `Value Chain`, `Critical Path`
        - If `Data/Metric`: `Input Metric`, `Output Metric`, `Leading KPI`, `Lagging KPI`, `Diagnostic Metric`, `North Star Metric`
        - If `Work/Action`: `Experiment`, `BAU (Business as Usual)`, `Initiative`, `Scope/Function`, `Business Driver`
        - If `Ideas/Hypothesis`: `Factor`, `Seller Solution`
- **Dimensions**
    - **Purpose:** To classify the metric based on its nature and primary use case, as defined in the analytics framework.
    - **UI:** This information is **hidden by default**. It is revealed via a click on a dedicated icon or button (e.g., in the card's footer or header). When revealed, it should be displayed as a **table in a modal or an expandable section**, similar to a UML database schema diagram.
    - **Available Dimensions:**
        - `Qualitative`: Answers "Why is this happening?"
        - `Quantitative`: Answers "How much? How many?"
        - `Vanity`: Looks good but isn't actionable.
        - `Actionable`: Informs a specific decision.
        - `Efficiency`: Measures resource utilization.
        - `Effectiveness`: Measures achievement of desired results.
        - `Strategic`: Tracks long-term goals.
        - `Tactical`: Evaluates specific projects/initiatives.
        - `Operational`: Monitors daily activities.
- **Causal Factor (Optional)**
    - **Purpose:** To diagnose the source of change in a metric, applying the Metric Drift Framework.
    - **UI:** An optional, single-select dropdown.
    - **Available Factors:**
        - `Component Drift`: Change due to inputs in the metric's definition.
        - `Temporal Variance`: Change due to natural, cyclic behavior.
        - `Influence Drift`: Change due to its relationship with other metrics.
        - `Dimension Drift`: Change in the dimensional composition of the metric.
        - `Event Shocks`: Abrupt changes from specific events.
- **Tags**
    - **Type:** `string[]`
    - **UI:** A standard tag input component.
    - **Purpose:** To provide a flexible, user-defined categorization system (e.g., "Q3-Focus," "Marketing-Funnel," "Financial").

### 5.2. Card Actions & Interactivity

These are functions accessible via icons, typically in the card's header or footer.

- **Header Actions:**
    - **Choose Category:** The primary dropdown to set the card's category. Selecting a `Data/Metric` type will dynamically add the placeholder for the `Data & Values` block.
    - **Copy/Duplicate:** Creates an identical copy of the card.
    - **Full Screen/Focus:** Expands the **Card Settings** into a side panel using the **Shadcn Sheet** component to display complementary content without leaving the main canvas view.
- Lower Body Actions:
	- **Add Causal Factor**: Dropdown to add Causal Factor (Refer to Card Attributes above). Then in settings user can add "Events" of this causal factor (for Event Shocks Metric Drift) at Events tab. User can add more than one causal factor.
	- **Tags*** : A tag input field to add or remove custom tags.
	- **Dimension Icon: Expand (can input data there.)**: An icon that, on click, expands or opens the modal containing the **Dimensions** table for viewing and editing.
- **Footer Actions (as suggested by icons):**
    - **Assignee:** Allows assigning one or more users to the card (for accountability).
    - **Comments:** Opens a thread for discussion related to the card.
    - **Chart Type:** For `Data/Metric` cards, allows toggling the visual representation of the data (e.g., from trend numbers to a line chart, bar chart, etc.).
    - **Data Source:** Indicates the source of the data and potentially allows for configuration (e.g., links to a specific database table, API endpoint, or analytics report).
    - **View Dimensions:** The dedicated action to open the Dimensions table.

**Card Structure:**
Random Generated Icon: Category: [Layer 1 Dropdown] > [Layer 2 Dropdown]: [Copy]   [Sheet View]

[Title: User Input Text]
[Description: User Input Text]

| Past 7 days        Past 6 weeks    Past 12 months |  
| 2,420.97             14,237.67           119,287.89 |
| -0.6% (down)     +6.98% (up)      +10.9% (up)

Causal Factor: [Optional Causal Factor Tag]: Tags: [Tag 1] [Tag 2]: Dimensions Icon: 

[Assignee]  [Comments]  [Chart Type]  [Data Source] 
 

### 5.3. The "Dimension Slice" Feature (Dimension Drift Analysis)
 The "Dimension Slice" feature, which allows for the systematic decomposition of metrics. A powerful card-level action designed to programmatically decompose a composite metric, providing the primary tool to investigate `Dimension Drift`.

#### 5.3.a. Trigger
- On any `Data/Metric` card, there is a button in its settings or context menu labeled **"Slice by Dimension."**

#### 5.3.b. Workflow
1. **Initiation:** The user clicks "Slice by Dimension" on a parent metric card (e.g., "Total Visitors").
2. **Dimension Input:** A modal appears, prompting the user: "State the dimensions to slice this metric by." The user provides a list of dimension names (e.g., `Paid`, `Organic`, `Viral`).
3. **System Transformation:** Upon confirmation, the system performs the following actions automatically:
    - **Creates New Cards:** Three new `Data/Metric` cards are created on the canvas, titled "Total Visitors (Paid)," "Total Visitors (Organic)," and "Total Visitors (Viral)."
    - **Connects New Cards:** `Deterministic` (or `Compositional`) relationship edges are drawn from each new "slice" card to the original "Total Visitors" card.
    - **Converts Parent Card:** The original "Total Visitors" card's `Source` type is switched to `Calculated`.
    - **Generates Formula:** Its formula is auto-populated to be the sum of its new children: `[ID_Paid].value + [ID_Organic].value + [ID_Viral].value`.
    - **Maintains Tree Structure:** This process programmatically deepens the metric tree while ensuring all connections remain logical and mathematically sound.

#### 5.3.c. Historical Data Disaggregation Strategy
When a metric is sliced, its historical data must be distributed among the new child metrics. The modal in Step 2 will present the user with the following options:
- **Option 1: Manual Entry:** The new slice cards are created with no historical data. The user must populate their values manually. This is the simplest approach.
- **Option 2: Proportional Split:** The user is asked to input percentages that sum to 100% (e.g., Paid: 40%, Organic: 50%, Viral: 10%). The system then distributes the parent's historical values across the children based on these fixed proportions.
- **Option 3: Forfeit History:** The parent's historical data is archived, and all new slice metrics start collecting data from the current date forward. This is a clean-slate approach.


## 6. Card Settings (Sheet View) Architecture

Details the functionality within the **Card Settings** view, accessed via the "Full Screen/Focus" (Sheet) action on a Metric Card. This view serves as the detailed configuration panel for each card.

###  6.1. Card Settings (Main View: Tab-Based Navigation)
The Card Settings UI is organized into a series of tabs to manage different aspects of the card's configuration.

| Details | Data | Source | Events | Key Results | Correlations | Comments | Setting |
| ------- | ---- | ------ | ------ | ----------- | ------------ | -------- | ------- |

At the bottom of the Details and Settings tab, there will be three main action buttons:
- **`Delete Card`**: (Red/destructive action) Permanently removes the card from the canvas.
- **`Cancel`**: Discards any changes made within the settings and closes the sheet.
- **`Save`**: Persists all changes made across all tabs. This button is disabled until a change is made.

#### 6.1.a. Details Tab
Provides an overview and display settings for the card's data visualization. 
- **Chart Options:**
    - **Date Granularity:** A dropdown to select the time aggregation for the chart display (`Day`, `Week`, `Month`, `Quarter`, `Year`).
    - **Chart Type:** A dropdown to select the data accumulation method (`Distribution` or `Incremental/Cumulative`).
- **Identification:**
    - **ID:** A read-only field displaying the card's randomly generated unique identifier.
    - **Description:** A text area for a user-facing description. _This field links directly to the `Description` attribute on the main Metric Card._
    - **Technical Description:** A separate text area for developer notes, API endpoints, or query details.
    - **Source:** A read-only field that displays the currently selected data source type (e.g., "Manual," "Calculated"). This is configured in the `Source` tab.

#### 6.1.b. Source Tab
Defines how the card gets its quantitative data. The content of this tab is dynamic based on the user's selection.
- **Source Selection Dropdown:**
    - **`Calculated`**:
        - **Functionality:** Enables a formula builder UI where users can reference other cards on the canvas by their ID or title (e.g., `[Metric Card ID].value`).
        - **UI:** Provides a text field for the formula and a list of standard arithmetic operators (`+`, `-`, `*`, `/`) and functions. The **Data** tab becomes read-only, displaying the results of the calculation.
    - **`Manual`**:
        - **Functionality:** Allows for direct data entry.
        - **UI:** The **Data** tab is enabled, presenting a spreadsheet-like interface.
    - **`Random Data`**:
        - **Functionality:** Generates placeholder data for modeling or testing.
        - **UI:** Presents input fields for `Standard Deviation`, `Upward Move Percentage`, and `Date Range`. A "Generate" button populates the data. The **Data** tab is read-only.

#### 6.1.c. Data Tab
The interface for viewing or inputting the card's raw data. Its state (editable vs. read-only) is determined by the `Source` tab selection.
- **UI:** A spreadsheet-like grid with columns for **Date** and **Value**.

#### 6.1.d. Events Tab
Manages annotations that overlay the card's chart, providing context for metric drifts and impacts.
- **UI:**
    - A timeline view that visualizes events on top of a chart of the metric's data.
    - An "Add Event" button.
- **Add/Edit Event Modal:** Clicking "Add Event" or an existing event opens a form with the following fields:
    - **Title**, **Event Date/Time**, **Due Date**, **Importance** (e.g., toggle switch), **Impact** (e.g., High/Medium/Low), **Drift Type** (Dropdown: `Component`, `Temporal`, etc.), **Summary** (text), **Goal/Hypothesis** (text), **Results** (text), **Type** (e.g., Launch, Outage), **URL Title**, **URL**, **Labels** (tags), **Contributors** (user tags), **Image Upload**.

#### 6.1.e. Key Results Tab
Defines OKR-style targets for the metric.
- **Time Unit:** Dropdown (`All Time`, `Yearly`, `Quarterly`, `Monthly`, `Custom Date Range`).
- **Starting Value:** Numerical input.
- **Target Value:** Numerical input.

#### 6.1.f. Correlations Tab
Provides analytics on the relationship between this metric and others.
- **UI:** A button labeled **"Compute Correlations."**
- **Functionality:** When clicked, this initiates a process to analyze and display a list of other metric cards that show a strong statistical correlation (positive or negative) with the current card's data.

#### 6.1.g. Comments Tab
A standard threaded discussion and note-taking area.
- **UI:** A text input field with a placeholder "Comment."
- **Functionality:** Supports rich text, image uploads, user mentions, and displays comments in a chronological thread with delete/edit functions.

#### 6.1.h. Setting Tab
Manages the core metadata and statistical properties of the card. It contains its own sub-navigation.
- **General**
    - **Name:** Editable text field. _Links to the `Title` on the Metric Card._
    - **URL / URL Title:** For linking to external resources.
    - **Owner:** A dropdown to select a single user as the primary owner. _Links to the `Assignee` list on the Metric Card (as the primary)._
    - **Category:** The two-layer dropdown to set the card's category. _Links to the `Category` on the Metric Card._
    - **Tags:** The tag input field. _Links to the `Tags` on the Metric Card._
- **Statistics**
    - **Roll Up Calculation:** Dropdown (`Sum`, `Average`, `Incremental`).
    - **Format/Unit:** Dropdown (`Number`, `Currency ($)`, `Percentage`, `Ratio`).
    - **Exclude Weekends?**: Boolean toggle.
    - **Positive Direction:** Dropdown (`Up` or `Down`).
    - **Decimal Places:** Min and Max numerical inputs.
- **Statistic Intervals**
    - **Standard Options:** Checkboxes for `Month-to-Date (MTD)`, `Quarter-to-date (QTD)`, `Year-to-date (YTD)`.
    - **Custom Intervals:** Three configurable slots (Interval Period 1, 2, 3) where the user can define a number and a format (`days`, `weeks`, `months`, `years`).
- **Segments**
    - **Functionality:** A UI for defining and managing data segments for more granular analysis (e.g., "Users from North America," "Mobile App Users"). This is an advanced feature for future development.


## 7. Connecting Component: The "Relationship"

Details the functionality of the **Relationship Component** (the "edge" or connection), transforming it from a simple line into a rich, interactive element that serves as a repository for analytical evidence and a guide for future experimentation.

Connections are the directed connections between nodes, representing the flow of influence or logic. They are as important as the nodes themselves. 


### 7.1. The Dynamic Edge: Visual Representation on the Canvas

The visual appearance of the connection between two cards is not static. It dynamically represents the nature and certainty of the relationship.
#### 7.1.a. Core Visual Attributes
- **Style (Confidence Level):** The line style directly reflects the confidence in the relationship's validity.
    - **High Confidence:** A solid, opaque, and thicker line. Represents a "surefire connection" that is well-understood and validated.
    - **Medium Confidence:** A dashed, less opaque line of medium thickness. Represents a relationship with some supporting evidence but requires further validation.
    - **Low Confidence:** A dotted, semi-transparent, and thin line. Represents a hypothesis or an "unsure" connection with little to no evidence.
- **Color (Relationship Type):** The line color indicates the type of relationship.
    - **`Deterministic`/`Compositional`:** A neutral color like gray or white, as these are definitional.
    - **`Probabilistic` (Correlation):**
        - **Green:** For a positive correlation.
        - **Red:** For a negative correlation.
    - **`Causal`:** A distinct color like **Orange** to signify a claimed cause-and-effect link.
#### 7.1.b. Interactive Overlays
- **Relationship Value Overlay:**
    - For `Probabilistic` and `Causal` relationships, a numerical value (e.g., the correlation coefficient or effect size) is displayed at the midpoint of the line.
    - Example: A green line with `+0.75` in the middle.
- **Zoom-Out Indicator:**
    - **Functionality:** When the user zooms out, a small indicator badge appears next to the relationship line.
    - **Content:** This badge displays a number representing the count of **supporting evidence items** (analyses, experiments, notebooks) attached to that relationship.
    - **Purpose:** Provides an at-a-glance overview of which relationships are well-researched and which are purely speculative, guiding the data team on where to focus their efforts.


### 7.2. The Relationship Sheet (Knowledge Hub)

Double-clicking a relationship edge or its zoom-out indicator opens the **Relationship Sheet**. This is the central repository for managing the "knowledge" behind the connection.

#### 7.2.a. Sheet Header
- Displays the source and target nodes. (e.g., **From:** "Ad Spend" **To:** "New User Signups").
- Shows the editable `Relationship Type` and `Confidence Level`.

#### 7.2.b. Evidence Repository
This is the core of the knowledge hub. It's a list of all the analytical artifacts that support or challenge the relationship.
- **UI:** A list or gallery view of all attached evidence.
- **"Add Evidence" Button:** Opens a modal to add a new artifact.
- **Structure of an "Evidence Item":**
    - **Title:** e.g., "Q2 A/B Test: New Ad Creative Impact"
    - **Type:** Dropdown (`Experiment`, `Analysis`, `Notebook`, `External Research`, `User Interview`).
    - **Date:** When the evidence was produced.
    - **Owner/Author:** The user(s) responsible for the artifact.
    - **Link:** A URL to the source (e.g., Jupyter Notebook on GitHub, Google Doc, BI dashboard).
    - **Hypothesis:** What was being tested?
    - **Summary/Results:** A brief summary of the findings. (e.g., "Test showed a 15% lift in signups with a p-value of 0.04").
    - **Impact on Confidence:** How did this evidence change the confidence level? (e.g., "Moved confidence from Low to Medium").

#### 7.2.c. Relationship Changelog (Influence Drift Analysis)
To address `Influence Drift`, the Relationship Sheet will contain a changelog to track the relationship's stability over time.
- **UI:** A new tab within the Relationship Sheet called **"History"** or **"Changelog."**
- **Functionality:**
    - This tab displays a time-series chart showing the `Weight/Value` (e.g., correlation coefficient) of the relationship calculated at different points in time (e.g., re-calculated quarterly).
    - Users can add annotations directly to this chart to explain significant changes, providing a clear record of when and why the influence between two metrics may have strengthened or weakened.
    - **Example:** "Q3 2025: Correlation dropped from 0.8 to 0.4 after the introduction of a new pricing model."

#### 7.2.d. Settings & Configuration
A section within the sheet for managing the relationship's properties.
- **Relationship Type:** Dropdown to select from `Deterministic`, `Probabilistic`, `Causal`, `Compositional`.
	-  **`Deterministic`**: A formulaic relationship. The target node's value is a direct calculation from the source node(s). (e.g., `Revenue = Price × Quantity`). Linked to **Source Tab** calculated mechanism.
	- **`Probabilistic`**: A correlational relationship. The nodes tend to move together, but one does not perfectly predict the other. Linked to **Calculate Correlation** tab.
	- **`Causal`**: A direct cause-and-effect link. A change in the source node is believed to directly cause a change in the target node. Same with calculate correlation, differences can be **mark differently.**
	- **`Compositional`**: A hierarchical relationship. The source node is a component part of the target node (e.g., `Organic Traffic` is a component of `Total Website Traffic`).
- **Confidence Level:** Dropdown to select `High`, `Medium`, or `Low`. Changing this immediately updates the visual style of the edge on the canvas.


### 7.3 Advanced Relationship & Decomposition Architecture

Details the dynamic workflows for setting up relationships.
#### 7.3.a Dynamic Relationship Workflow

Setting up a relationship is an interactive process where the UI adapts based on the chosen `Relationship Type`, guiding the user through a logical workflow.

#### 7.3.b `Deterministic` Relationship Workflow

This type is used for definitional or formulaic connections.
1. **Selection:** The user selects `Deterministic` in the Relationship Sheet.
2. **System Action:** This action immediately affects the **target node** of the relationship.
    - The system navigates the user to the target node's **Card Settings** and automatically selects the `Source` tab.
    - The source type is set to `Calculated`.
3. **User Action:** The user builds a formula in the target node's formula builder. The formula now includes a reference to the **source node**. The concept of "weight" is integrated directly into this formula (e.g., `0.7 * [Source Node ID].value`).

#### 7.3.c `Probabilistic` vs. `Causal` Relationship Workflow

These types are used for non-definitional connections that require evidence. The workflow encourages a deliberate process of graduating from correlation to causation.
1. **Step 1: Establishing Correlation (`Probabilistic`)**
    - A user hypothesizes a link between two metric cards. They create an edge and open the Relationship Sheet.
    - The user navigates to the `Correlations` tab within one of the card's settings and runs the "Compute Correlation" function.
    - If a statistically significant correlation is found, the user sets the edge type to `Probabilistic`, enters the correlation coefficient in the `Weight/Value` field, and sets the `Confidence Level` to `Low` or `Medium`.
    - They can then attach the correlation analysis as the first piece of evidence in the Relationship Sheet's **Evidence Repository**.
2. **Step 2: Asserting Causation (`Causal`)**
    - To upgrade a relationship from `Probabilistic` to `Causal`, the user must provide more rigorous evidence beyond simple correlation.
    - **UI - The Causal Checklist:** When `Causal` is selected, a "Causal Checklist" appears in the Relationship Sheet. The user must reason through and check off criteria based on their domain knowledge and evidence. The checklist could include:
        - **Temporal Precedence:** Does the cause happen before the effect?
        - **Covariation:** Is there a clear statistical relationship? (Inherited from the probabilistic step).
        - **Non-Spuriousness:** Have we ruled out potential confounding variables?
        - **Mechanism:** Is there a logical reason why this cause would lead to this effect?
    - The relationship is **marked differently** on the canvas with a distinct color (e.g., Orange) to show that a claim of causality, not just correlation, is being made.


## 8. Canvas Built-in Function: Grouping, Layout, Toolbar and Control Function

This document details the architecture for high-level organizational and usability features within the main Metrimap canvas, including the grouping of nodes (Subflows), automatic layout, and the primary user control interfaces.

### 8.1. Grouping & Subflows on the Canvas

This feature allows users to visually organize related nodes into logical groups directly on the canvas, providing contextual layers and a foundation for structured reporting.
- **Functionality (Inspired by React Flow's "Sub Flows"):**
    - Users can create a "Group" or "Subflow" node on the canvas.
    - This group acts as a container. Users can drag and drop existing Metric Cards into this group, or create new cards within it.
    - The group node can be named (e.g., "Customer Acquisition Funnel," "Core Financials," "User Retention Loop"). **This name is critical as it becomes the title of the corresponding dashboard**.
    - The system will enforce a parent-child relationship in the node data structure, ensuring parent group nodes are processed before their child metric cards.
- **Purpose & Strategic Alignment:**
    - **Contextual Clarity:** Groups visually partition the metric tree into its logical "limbs," making complex maps easier to understand.
    - **Foundation for Dashboards:** Each named group becomes a candidate for a dashboard, solving the problem of dashboard sprawl by ensuring every dashboard has a clear, structural purpose derived directly from the business model.

### 8.2. Auto-Layout using Dagre

To maintain a clean and readable structure, especially in complex metric trees, the application will integrate an automatic layouting engine.
- **Engine:** The system will use the **Dagre** layout library, which is specifically designed for directed graphs. This is ideal for creating clear, hierarchical, top-to-bottom or left-to-right layouts for tree-like structures.
- **Functionality:**
    - A "Re-Layout" button will be available in the canvas toolbar.
    - When clicked, Dagre will automatically calculate the optimal positions for all nodes and groups on the canvas, minimizing edge crossings and arranging nodes in a tidy, hierarchical fashion.
    - This saves users significant time compared to manually arranging each node, allowing them to focus on the model's logic rather than its aesthetics.

### 8.3. React Flow Node Toolbar

When a user selects one or more nodes on the canvas, a contextual toolbar will appear, providing quick access to common actions.
- **Functionality:** This is a floating toolbar that appears directly above the selected node(s).
- **Available Actions:**
    - **Edit:** Opens the **Card Settings Sheet** for the selected card, providing access to all its detailed configurations.
    - **Copy/Duplicate:** Creates an identical copy of the selected card(s) and their settings on the canvas.
    - **Collapse/Expand:** For `Data/Metric` cards, this action can toggle the visibility of the detailed data-and-values block, collapsing it to a simpler view showing only the title and category to save space.
    - **Delete:** Removes the selected node(s) and their associated connections from the canvas.

### 8.4. React Flow Panel (Canvas Controls)

A control panel, typically located in the bottom-right corner of the canvas, provides global controls for the entire view.
- **Standard Controls:**
    - **Zoom In (+):** Increases the magnification of the canvas.
    - **Zoom Out (-):** Decreases the magnification of the canvas.
    - **Fit to View:** Automatically adjusts the zoom and pan so that all nodes on the canvas are visible within the current viewport.
    - **Lock/Unlock:** Toggles the ability to drag nodes, preventing accidental layout changes.
- **Centralized Date Range Picker:**
    - **UI:** A prominent date range picker located within this control panel.
    - **Functionality:** This is a global filter that controls the time period for **all** `Data/Metric` cards on the canvas simultaneously. When a user selects a new date range (e.g., "Last Quarter," "This Year"), every metric card that displays time-series data will refresh to show the values and trend comparisons for that specific period.
    - **Purpose & Strategic Alignment:** This powerful feature allows for consistent, time-based analysis across the entire business model. A user can instantly see how the entire system performed during a specific marketing campaign, product launch, or economic event, making temporal analysis and business reviews significantly more effective.

# The Metrimap: User Stories
### 9. Epic: Project & Canvas Management

**Feature: Homepage & Project Navigation**
- **As a** user, **I want to** see all my canvas projects on a single homepage, **so that** I can quickly find and access the model I need to work on.
- **As a** user, **I want to** create a new, blank canvas from the homepage, **so that** I can start building a new business model from scratch.
- **As a** user, **I want to** see key metadata on each canvas card (like name, last modified date, and collaborators), **so that** I can easily identify the correct project.
- **As a** user, **I want to** search and filter my canvases by name or tag, **so that** I can find specific projects quickly in a large collection.
- **As a** user, **I want** a persistent sidebar to appear once I enter a canvas, **so that** I can easily navigate between the different views (Canvas, Dashboard, Assets, etc.) of my project.

**Feature: Canvas Settings & Changelog**
- **As a** user, **I want to** edit the name, description, and tags for my canvas project, **so that** I can keep its metadata organized and up-to-date.
- **As a** user, **I want to** view an immutable, reverse-chronological changelog for my canvas, **so that** I can track all significant changes and understand how the model has evolved over time.
- **As a** collaborator, **I want to** see who made what change and when in the changelog, **so that** there is full transparency and accountability in the model-building process.

### **Epic: Core Model Building (Canvas Interaction)**

**Feature: Node Creation & Management**
- **As a** modeler, **I want to** create a new "card" (node) on the canvas, **so that** I can represent a component of my business model, such as a metric, action, or hypothesis.
- **As a** modeler, **I want to** give each card a title and a detailed description, **so that** I can clearly label and define each component of my model.
- **As a** modeler, **I want to** assign a two-layer category to each card (e.g., `Data/Metric > North Star Metric`), **so that** I can structurally define the node's role in the system.
- **As a** modeler, **I want to** select multiple nodes at once, **so that** I can move, group, or delete them efficiently.
- **As a** modeler, **I want to** use a contextual toolbar on a selected node, **so that** I can quickly perform common actions like editing, copying, or deleting.
- **As a** modeler, **I want to** have all my changes on the canvas auto-saved, **so that** I don't lose my work and can iteratively develop the model over multiple sessions.

**Feature: Relationship Creation & Management**
- **As a** modeler, **I want to** draw a directed connection (an edge) between two cards, **so that** I can visually represent the logical or causal relationship between them.
- **As a** modeler, **I want to** define the type of relationship (e.g., `Deterministic`, `Causal`, `Probabilistic`), **so that** I can accurately model the logic of my business.
- **As a** modeler, **I want the** visual style of the connection (color and line style) to automatically update based on its type and confidence level, **so that** I can instantly see the nature and certainty of the links in my model.

**Feature: Canvas Usability & Navigation**
- **As a** user, **I want to** pan and zoom freely on the canvas, **so that** I can navigate large and complex metric trees easily.
- **As a** modeler, **I want to** use an auto-layout feature, **so that** I can automatically arrange my metric tree into a clean, hierarchical structure without manual effort.
- **As a** user, **I want to** use a global date range picker, **so that** I can filter the data for all metric cards on the canvas simultaneously and analyze performance for a specific period.
- **As a** modeler, **I want to** group related nodes into a named "Subflow" container, **so that** I can visually organize my canvas into logical sections like "Marketing Funnel" or "Financials."

### **Epic: Detailed Metric & Data Configuration**

**Feature: Metric Card Functionality**
- **As a** user, **I want** a `Data/Metric` card to display time-series data with values and trend indicators, **so that** I can quickly assess the performance of a metric.
- **As a** strategist, **I want to** assign "Dimensions" (e.g., `Quantitative`, `Actionable`, `Strategic`) to a metric card, **so that** I can classify its primary analytical purpose.
- **As a** diagnostician, **I want to** optionally tag a metric with a `Causal Factor` (e.g., `Component Drift`, `Dimension Drift`), **so that** I can track my diagnosis for why a metric has changed.
- **As a** modeler, **I want to** programmatically "Slice by Dimension" on a metric card, **so that** I can automatically decompose it into its constituent parts (e.g., 'Total Visitors' into 'Paid', 'Organic', 'Viral') and maintain a logical tree structure.
- **As a** user, **I want to** choose how historical data is handled when I slice a metric (Manual Entry, Proportional Split, or Forfeit History), **so that** I can manage the data transition according to my needs.

**Feature: Card Settings (Sheet View)**
- **As a** modeler, **I want to** open a detailed "Card Settings" sheet, **so that** I can perform advanced configuration for a specific card without cluttering the main canvas.
- **As a** modeler, **I want to** define how a card gets its data by selecting a source (`Manual`, `Calculated`, or `Random`), **so that** I can model everything from direct inputs to complex formulas.
- **As a** modeler, **I want to** use a formula builder for `Calculated` metrics that lets me reference other cards, **so that** I can create `Deterministic` relationships and build a live financial model.
- **As a** user, **I want to** add contextual "Events" (like a product launch or marketing campaign) to a metric's timeline, **so that** I can explain and understand "Event Shocks" and other metric drifts.
- **As a** manager, **I want to** set `Key Results` (OKRs) with target values for a metric, **so that** I can track progress against specific goals.
- **As a** data scientist, **I want to** run a "Compute Correlations" function, **so that** I can discover statistically significant relationships between metrics and generate hypotheses.

### **Epic: Knowledge Management & Reporting**

**Feature: Relationship as a Knowledge Hub**
- **As a** data scientist, **I want to** attach "Evidence" (like notebooks, analyses, or experiment results) to a relationship, **so that** I can build a repository of knowledge that validates or challenges the connection.
- **As a** strategist, **I want to** use a "Causal Checklist" when defining a causal link, **so that** I am guided through a more rigorous process than just assuming correlation equals causation.
- **As a** user, **I want to** see a "History" or "Changelog" for a relationship's strength over time, **so that** I can analyze `Influence Drift` and see if the connection is stable.
- **As a** data team lead, **I want to** see an indicator for the number of evidence items on a relationship when zoomed out, **so that** I can quickly identify which parts of our model are well-researched and which are purely speculative.

**Feature: Dashboards & Business Reviews**
- **As a** user, **I want** dashboards to be automatically generated from the "Subflow" groups I create on the canvas, **so that** my reporting is always directly linked to the structure of my business model.
- **As a** team lead, **I want to** use a dashboard to run a business review, **so that** I can anchor the discussion on a specific part of the model and "drill on the reds" to investigate underperforming metrics.

**Feature: Centralized Asset Management (Assets & Source Pages)**
- **As a** manager, **I want to** use the "Assets" page to get a searchable, table-based view of all metrics and relationships, **so that** I can manage the components of my model in bulk.
- **As a** researcher, **I want to** use the "Repo" tab on the Assets page, **so that** I can find any piece of analysis or experiment conducted across the entire canvas in one central place.
- **As a** data engineer, **I want to** use the "Source" page to manage the data instrumentation pipeline, **so that** I can track the status of event collection for each metric and ensure the data is reliable.
Each has their own algorithm and mechanism.


## Tech Stack for Client-Side Computation

Tech stack, tailored for an internal tool with browser-based computation:
- **Core Framework:** React + TypeScript + Vite
- **Canvas:** React Flow with Dagre for auto-layout
- **UI & Styling:** Shadcn, Recharts, Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** Tanstack/React Query to manage data from Supabase
- **Database:** **Supabase** (using the `supabase-js` client and Database Functions)
- **Client-Side Computation:**
    - **Threading:** **Web Workers** (with `comlink` for easier use)
    - **Formula Engine:** `math.js`
    - **Statistics:** `simple-statistics`
- **Deployment:** Vercel
- **DevOps & CI/CD:**
	- **Git Hooks:** Husky
	- **CI/CD:** GitHub Actions
	- **Code Quality:** **Typescript-ESLint** (for linting) & **Prettier** (for formatting)
- **Testing:** Vitest
- **Build & Bundle Optimization:**
	- **Code Splitting:** `React.lazy()` for routes
	- **Bundle Analysis:** **`rollup-plugin-visualizer`**