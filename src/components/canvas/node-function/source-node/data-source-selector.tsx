"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Edit3, Shuffle, ArrowRight } from "lucide-react";

interface DataSourceSelectorProps {
  onSourceSelect: (sourceType: "sources" | "manual" | "generated") => void;
  currentSource?: "sources" | "manual" | "generated" | null;
}

export default function DataSourceSelector({
  onSourceSelect,
  currentSource,
}: DataSourceSelectorProps) {
  if (currentSource) return null;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Configure Data Source
          </h2>
          <p className="text-gray-600">
            Choose how you want to input data for this transformation node
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
            onClick={() => onSourceSelect("sources")}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect to Sources</h3>
              <p className="text-gray-600 mb-4">
                Connect to external data sources like databases, APIs, or file
                systems.
              </p>
              <div className="space-y-2 mb-4">
                <Badge variant="secondary" className="mr-2">
                  Data Warehouse
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  CSV Files
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Google Sheets
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  APIs
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Databases
                </Badge>
              </div>
              <Button className="w-full group-hover:bg-blue-600">
                Configure Sources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300 group"
            onClick={() => onSourceSelect("manual")}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                  <Edit3 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manual Entry</h3>
              <p className="text-gray-600 mb-4">
                Manually input your data using a spreadsheet-like interface or
                paste from clipboard.
              </p>
              <div className="space-y-2 mb-4">
                <Badge variant="secondary" className="mr-2">
                  Spreadsheet UI
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Paste from Clipboard
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  CSV Import
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  JSON Import
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Custom Schema
                </Badge>
              </div>
              <Button className="w-full group-hover:bg-green-600">
                Start Manual Entry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300 group"
            onClick={() => onSourceSelect("generated")}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors">
                  <Shuffle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Generate Sample Data
              </h3>
              <p className="text-gray-600 mb-4">
                Generate realistic sample data for testing, prototyping, or
                learning purposes.
              </p>
              <div className="space-y-2 mb-4">
                <Badge variant="secondary" className="mr-2">
                  User Data
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Sales Data
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Analytics Data
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Custom Schema
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  Time Series
                </Badge>
              </div>
              <Button className="w-full group-hover:bg-purple-600">
                Generate Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
