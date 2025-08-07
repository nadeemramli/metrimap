"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Target,
  Plus,
  Milestone,
  Save,
} from "lucide-react";
import { useCanvasStore } from "@/lib/stores";

// Generate chart data from real card data
const generateChartData = (
  card: any,
  _granularity: string,
  chartType: string
) => {
  // Use real data if available
  if (card?.data && Array.isArray(card.data) && card.data.length > 0) {
    let chartData = card.data.map((item: any, index: number) => ({
      date: item.period || `Period ${index + 1}`,
      value:
        typeof item.value === "number"
          ? item.value
          : parseFloat(item.value) || 0,
      events: item.events || 0,
      trend: item.trend || "neutral",
      change_percent: item.change_percent || 0,
    }));

    if (chartType === "Cumulative") {
      let cumulative = 0;
      chartData = chartData.map((item: any) => {
        cumulative += item.value;
        return { ...item, value: cumulative };
      });
    }

    return chartData;
  }

  // Fallback to sample data structure for new cards
  const sampleData = [
    {
      date: "Week 1",
      value: 0,
      events: 0,
      trend: "neutral",
      change_percent: 0,
    },
    {
      date: "Week 2",
      value: 0,
      events: 0,
      trend: "neutral",
      change_percent: 0,
    },
    {
      date: "Week 3",
      value: 0,
      events: 0,
      trend: "neutral",
      change_percent: 0,
    },
    {
      date: "Week 4",
      value: 0,
      events: 0,
      trend: "neutral",
      change_percent: 0,
    },
  ];

  return sampleData;
};

interface DataEventsTabProps {
  cardId?: string;
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

export function DataEventsTab({
  cardId,
  onSave,
  isModified,
  onFieldChange,
}: DataEventsTabProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  // Adapter functions to match the v0 interface
  const updateCard = (updates: any) => {
    if (card && cardId) {
      persistNodeUpdate(cardId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      // Notify parent about changes
      if (onFieldChange) {
        Object.entries(updates).forEach(([field, value]) => {
          onFieldChange(field, value);
        });
      }
    }
  };

  const addEvent = (event: any) => {
    if (card && cardId) {
      const currentEvents = (card as any).events || [];
      persistNodeUpdate(cardId, {
        events: [...currentEvents, event],
        updatedAt: new Date().toISOString(),
      } as any);
    }
  };
  const [showCumulative, setShowCumulative] = useState(false);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showEventDialog, setShowEventDialog] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "milestone" as Event["type"],
  });

  if (!card) return <></>;

  // Provide fallback values for chart options since our card structure is different
  const chartOptions = {
    dateGranularity: (card as any).chartOptions?.dateGranularity || "Weekly",
    chartType: (card as any).chartOptions?.chartType || "Incremental",
  };

  const chartData = generateChartData(
    card,
    chartOptions.dateGranularity,
    showCumulative ? "Cumulative" : chartOptions.chartType
  );

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
    events: {
      label: "Events",
      color: "hsl(var(--chart-2))",
    },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleEditValue = (date: string, currentValue: number) => {
    setEditingRow(date);
    setEditValue(currentValue.toString());
  };

  const handleSaveEdit = async () => {
    if (editingRow && editValue !== null && card && cardId) {
      try {
        // Get current data array or create new one
        const currentData = card.data || [];

        // Find the data entry to update or create new one
        const existingIndex = currentData.findIndex(
          (item) => item.period === editingRow
        );

        if (existingIndex !== -1) {
          // Update existing entry
          const updatedData = [...currentData];
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            value: parseFloat(editValue) || 0,
          };
          await updateCard({ data: updatedData });
        } else {
          // Create new entry
          const newEntry = {
            period: editingRow,
            value: parseFloat(editValue) || 0,
            change_percent: 0,
            trend: "neutral" as const,
          };
          const updatedData = [...currentData, newEntry];
          await updateCard({ data: updatedData });
        }

        setEditingRow(null);
        setEditValue("");
      } catch (error) {
        console.error("Failed to save data:", error);
        alert("Failed to save data. Please try again.");
      }
    } else {
      setEditingRow(null);
      setEditValue("");
    }
  };

  const handleAddEventToDate = (date: string) => {
    setNewEvent({ ...newEvent, date });
    setShowEventDialog(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title) {
      addEvent({
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date),
        type: newEvent.type,
      });
      setNewEvent({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        type: "milestone",
      });
      setShowEventDialog(false);
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      width: 552,
      height: 400,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (chartOptions.chartType) {
      case "Distribution":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case "Incremental":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--color-value)", strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Data Visualization & Events
              </CardTitle>
              <CardDescription>
                Interactive data visualization with event annotations
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showCumulative}
                  onCheckedChange={setShowCumulative}
                  id="cumulative"
                />
                <label htmlFor="cumulative" className="text-sm font-medium">
                  Show cumulative total
                </label>
              </div>
              {onSave && (
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={!isModified}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Configuration */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period
              </label>
              <Select
                value={chartOptions.dateGranularity}
                onValueChange={(value: any) =>
                  updateCard({
                    chartOptions: {
                      ...chartOptions,
                      dateGranularity: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select
                value={chartOptions.chartType}
                onValueChange={(value: any) =>
                  updateCard({
                    chartOptions: {
                      ...chartOptions,
                      chartType: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Distribution">
                    Distribution (Bar)
                  </SelectItem>
                  <SelectItem value="Incremental">
                    Incremental (Area)
                  </SelectItem>
                  <SelectItem value="Cumulative">Cumulative (Line)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Line
              </label>
              <Input
                type="number"
                placeholder="Add target value"
                className="w-full"
              />
            </div>
          </div>

          {/* Chart */}
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              {renderChart()}
            </ChartContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1"></div>
              <span className="text-sm font-medium">
                {card.title} (Level 2)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2"></div>
              <span className="text-sm font-medium">Events</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table with Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Points & Events</CardTitle>
              <CardDescription>
                View and edit data points, add events to specific dates
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRowDate = `Row ${(card?.data?.length || 0) + 1}`;
                  handleEditValue(newRowDate, 0);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Data Row
              </Button>
              <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                      Create an event annotation for your data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={newEvent.title}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, title: e.target.value })
                          }
                          placeholder="Event title"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select
                          value={newEvent.type}
                          onValueChange={(value: Event["type"]) =>
                            setNewEvent({ ...newEvent, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="milestone">Milestone</SelectItem>
                            <SelectItem value="change">Change</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            description: e.target.value,
                          })
                        }
                        placeholder="Event description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddEvent}>Add Event</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowEventDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <MoreHorizontal className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export Data</DropdownMenuItem>
                  <DropdownMenuItem>Import Data</DropdownMenuItem>
                  <DropdownMenuItem>Add Data Point</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowEventDialog(true)}>
                    Add Event
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Clear All Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-muted/50 rounded-lg font-medium text-sm">
              <div>Date</div>
              <div>Value</div>
              <div>Events</div>
              <div>Event Actions</div>
              <div className="text-right">Data Actions</div>
            </div>

            {/* Table Rows */}
            {chartData.map((item: any) => (
              <div
                key={item.date}
                className="grid grid-cols-5 gap-4 py-3 px-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="font-mono text-sm">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="font-mono text-sm">
                  {editingRow === item.date ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 w-24"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") setEditingRow(null);
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSaveEdit}
                      >
                        ✓
                      </Button>
                    </div>
                  ) : (
                    formatValue(item.value)
                  )}
                </div>
                <div>
                  {item.events > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {item.events} event{item.events !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddEventToDate(item.date)}
                    className="h-8 text-xs"
                  >
                    <Milestone className="h-3 w-3 mr-1" />
                    Add Event
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditValue(item.date, item.value)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      {((card as any).events || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest event annotations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {((card as any).events || []).slice(0, 3).map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <Milestone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {event.date.toLocaleDateString()}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
