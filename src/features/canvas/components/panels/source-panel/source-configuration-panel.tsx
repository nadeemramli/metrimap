"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Database,
  FileSpreadsheet,
  Globe,
  TestTube,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface SourceConfig {
  type: string;
  config: any;
}

interface SourceConfigurationPanelProps {
  onConfigComplete: (config: SourceConfig, data: any[]) => void;
  onBack: () => void;
}

export default function SourceConfigurationPanel({
  onConfigComplete,
  onBack,
}: SourceConfigurationPanelProps) {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [config, setConfig] = useState<any>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate connection and data fetching
    setTimeout(() => {
      const mockData = generateMockDataForSource(selectedSource);
      onConfigComplete({ type: selectedSource, config }, mockData);
      setIsConnecting(false);
    }, 2000);
  };

  const generateMockDataForSource = (sourceType: string) => {
    // Generate appropriate mock data based on source type
    switch (sourceType) {
      case "warehouse":
        return [
          {
            user_id: 1,
            event_name: "page_view",
            timestamp: "2024-01-01 10:00:00",
            value: 1,
          },
          {
            user_id: 2,
            event_name: "click",
            timestamp: "2024-01-01 10:05:00",
            value: 1,
          },
          {
            user_id: 1,
            event_name: "purchase",
            timestamp: "2024-01-01 10:10:00",
            value: 99.99,
          },
        ];
      case "csv":
        return [
          { name: "John Doe", age: 30, city: "New York", salary: 75000 },
          { name: "Jane Smith", age: 25, city: "San Francisco", salary: 85000 },
          { name: "Bob Johnson", age: 35, city: "Chicago", salary: 65000 },
        ];
      case "sheets":
        return [
          { product: "Widget A", sales: 150, revenue: 15000, month: "January" },
          { product: "Widget B", sales: 200, revenue: 25000, month: "January" },
          {
            product: "Widget A",
            sales: 175,
            revenue: 17500,
            month: "February",
          },
        ];
      default:
        return [];
    }
  };

  const renderSourceConfig = () => {
    switch (selectedSource) {
      case "warehouse":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="host">Database Host</Label>
              <Input
                id="host"
                placeholder="localhost:5432"
                value={config.host || ""}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                placeholder="analytics_db"
                value={config.database || ""}
                onChange={(e) =>
                  setConfig({ ...config, database: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="user"
                value={config.username || ""}
                onChange={(e) =>
                  setConfig({ ...config, username: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={config.password || ""}
                onChange={(e) =>
                  setConfig({ ...config, password: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="query">SQL Query (Optional)</Label>
              <Textarea
                id="query"
                placeholder="SELECT * FROM events WHERE date >= '2024-01-01'"
                value={config.query || ""}
                onChange={(e) =>
                  setConfig({ ...config, query: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "csv":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">CSV File</Label>
              <Input id="file" type="file" accept=".csv" />
            </div>
            <div>
              <Label htmlFor="delimiter">Delimiter</Label>
              <Select
                value={config.delimiter || ","}
                onValueChange={(value) =>
                  setConfig({ ...config, delimiter: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="|">Pipe (|)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasHeader"
                checked={config.hasHeader !== false}
                onChange={(e) =>
                  setConfig({ ...config, hasHeader: e.target.checked })
                }
              />
              <Label htmlFor="hasHeader">First row contains headers</Label>
            </div>
          </div>
        );
      case "sheets":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sheetUrl">Google Sheets URL</Label>
              <Input
                id="sheetUrl"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={config.sheetUrl || ""}
                onChange={(e) =>
                  setConfig({ ...config, sheetUrl: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                placeholder="Sheet1"
                value={config.sheetName || "Sheet1"}
                onChange={(e) =>
                  setConfig({ ...config, sheetName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="range">Range (Optional)</Label>
              <Input
                id="range"
                placeholder="A1:Z1000"
                value={config.range || ""}
                onChange={(e) =>
                  setConfig({ ...config, range: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "api":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">API Endpoint</Label>
              <Input
                id="apiUrl"
                placeholder="https://api.example.com/data"
                value={config.apiUrl || ""}
                onChange={(e) =>
                  setConfig({ ...config, apiUrl: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={config.method || "GET"}
                onValueChange={(value) =>
                  setConfig({ ...config, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="headers">Headers (JSON)</Label>
              <Textarea
                id="headers"
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                value={config.headers || ""}
                onChange={(e) =>
                  setConfig({ ...config, headers: e.target.value })
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "warehouse":
        return <Database className="h-5 w-5" />;
      case "csv":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "sheets":
        return <Globe className="h-5 w-5" />;
      case "api":
        return <TestTube className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Configure Data Source</h2>
          <p className="text-gray-600">
            Set up your connection to retrieve data
          </p>
        </div>
      </div>

      {!selectedSource ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "warehouse",
              name: "Data Warehouse",
              desc: "PostgreSQL, MySQL, etc.",
            },
            { id: "csv", name: "CSV File", desc: "Upload or select CSV files" },
            {
              id: "sheets",
              name: "Google Sheets",
              desc: "Connect to Google Sheets",
            },
            { id: "api", name: "REST API", desc: "Fetch data from APIs" },
          ].map((source) => (
            <Card
              key={source.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
              onClick={() => setSelectedSource(source.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getSourceIcon(source.id)}
                </div>
                <h3 className="font-semibold">{source.name}</h3>
                <p className="text-sm text-gray-600">{source.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {getSourceIcon(selectedSource)}
              <CardTitle className="capitalize">
                {selectedSource} Configuration
              </CardTitle>
              <Badge
                variant="outline"
                onClick={() => setSelectedSource("")}
                className="cursor-pointer"
              >
                Change
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSourceConfig()}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedSource("")}>
                Back
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConnecting ? "Connecting..." : "Connect & Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
