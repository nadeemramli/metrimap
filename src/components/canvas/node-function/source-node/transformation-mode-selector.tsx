"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Wand2, ArrowRight } from "lucide-react";

interface TransformationModeSelectorProps {
  onModeSelect: (mode: "basic" | "advanced") => void;
  currentMode?: "basic" | "advanced" | null;
}

export default function TransformationModeSelector({
  onModeSelect,
  currentMode,
}: TransformationModeSelectorProps) {
  if (currentMode) return null;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
          onClick={() => onModeSelect("basic")}
        >
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                <Wand2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Basic Transformations
            </h3>
            <p className="text-gray-600 mb-4">
              Use visual tools and pre-built operations to transform your data
              without writing code.
            </p>
            <div className="space-y-2 mb-4">
              <Badge variant="secondary" className="mr-2">
                Filter Rows
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Group By
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Sort
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Join Tables
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Aggregate
              </Badge>
            </div>
            <Button className="w-full group-hover:bg-green-600">
              Start with Basic
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300 group"
          onClick={() => onModeSelect("advanced")}
        >
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors">
                <Code className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Advanced Transformations
            </h3>
            <p className="text-gray-600 mb-4">
              Write custom SQL queries or Python scripts for complex data
              transformations and analysis.
            </p>
            <div className="space-y-2 mb-4">
              <Badge variant="secondary" className="mr-2">
                SQL Queries
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Python Scripts
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Custom Functions
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Complex Logic
              </Badge>
              <Badge variant="secondary" className="mr-2">
                ML Operations
              </Badge>
            </div>
            <Button className="w-full group-hover:bg-purple-600">
              Start with Advanced
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
