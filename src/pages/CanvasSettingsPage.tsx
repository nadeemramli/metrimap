import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Edit3, Clock } from "lucide-react";

type TabType = "general" | "data" | "changelog";

// Mock data
const mockCanvasData = {
  name: "SaaSCo Q3 Growth Model",
  description:
    "Customer acquisition and revenue optimization analysis for Q3 planning",
  labels: ["Marketing", "Finance", "In Progress"],
};

const mockCards = [
  {
    id: "1",
    title: "Monthly Recurring Revenue",
    category: "Data/Metric → North Star Metric",
    lastValue: "$124,567",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    title: "Customer Acquisition Cost",
    category: "Data/Metric → Leading KPI",
    lastValue: "$89",
    lastUpdated: "2024-01-14",
  },
];

const mockChangelog = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:22",
    user: "John Doe",
    action: "created",
    target: "card",
    targetName: "New User Signups",
    description: "Created card 'New User Signups'",
  },
  {
    id: "2",
    timestamp: "2024-01-15 13:45:18",
    user: "Sarah Kim",
    action: "deleted",
    target: "relationship",
    targetName: "Ad Spend → New User Signups",
    description: "Deleted relationship from 'Ad Spend' to 'New User Signups'",
  },
  {
    id: "3",
    timestamp: "2024-01-15 12:20:45",
    user: "John Doe",
    action: "changed confidence",
    target: "relationship",
    targetName: "Speed to Lead → Win Rate",
    description:
      "Changed confidence on relationship 'Speed to Lead → Win Rate' from Low to Medium",
  },
  {
    id: "4",
    timestamp: "2024-01-15 11:15:32",
    user: "Mike Chen",
    action: "updated formula",
    target: "card",
    targetName: "LTV",
    description: "Updated the formula for card 'LTV'",
  },
  {
    id: "5",
    timestamp: "2024-01-15 10:30:15",
    user: "Sarah Kim",
    action: "created",
    target: "subflow",
    targetName: "Retention Analysis",
    description: "Created the subflow group 'Retention Analysis'",
  },
];

export default function CanvasSettingsPage() {
  const { canvasId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [canvasName, setCanvasName] = useState(mockCanvasData.name);
  const [canvasDescription, setCanvasDescription] = useState(
    mockCanvasData.description
  );
  const [canvasLabels, setCanvasLabels] = useState(
    mockCanvasData.labels.join(", ")
  );

  const tabs = [
    { id: "general" as const, label: "General" },
    { id: "data" as const, label: "Data" },
    { id: "changelog" as const, label: "Canvas Changelog" },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "deleted":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case "updated formula":
      case "changed confidence":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    console.log("Saving canvas settings...");
  };

  const handleDeleteCanvas = () => {
    if (
      confirm(
        "Are you sure you want to delete this canvas? This action cannot be undone."
      )
    ) {
      // TODO: Delete canvas from Supabase
      console.log("Deleting canvas...");
    }
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Canvas Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage project metadata and configuration
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Canvas {canvasId}</div>
      </div>

      <div className="h-[calc(100%-3.5rem)] flex flex-col">
        {/* Tabs */}
        <div className="border-b border-border bg-card">
          <div className="px-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "general" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Canvas Name
                </label>
                <input
                  type="text"
                  value={canvasName}
                  onChange={(e) => setCanvasName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={canvasDescription}
                  onChange={(e) => setCanvasDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Labels/Tags
                </label>
                <input
                  type="text"
                  value={canvasLabels}
                  onChange={(e) => setCanvasLabels(e.target.value)}
                  placeholder="Marketing, Finance, In Progress"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple labels with commas
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
                <div className="flex-1" />
                <Button
                  variant="destructive"
                  onClick={handleDeleteCanvas}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Canvas
                </Button>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Canvas Data
                </h3>
                <p className="text-muted-foreground">
                  Quick access to all cards in this canvas for editing
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Card Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {mockCards.map((card) => (
                      <tr key={card.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-card-foreground">
                            {card.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {card.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {card.lastValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {card.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "changelog" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Canvas Changelog
                </h3>
                <p className="text-muted-foreground">
                  Complete audit trail of all changes to this canvas
                </p>
              </div>

              <div className="space-y-4">
                {mockChangelog.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2">
                        {getActionIcon(entry.action)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-card-foreground">
                            {entry.user}
                          </span>
                          <span className="text-muted-foreground">
                            {entry.action}
                          </span>
                          <span className="font-medium text-card-foreground">
                            {entry.target}
                          </span>
                          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                            {entry.targetName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {entry.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
