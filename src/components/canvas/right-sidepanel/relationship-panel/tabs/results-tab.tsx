"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useCanvasStore } from "@/lib/stores";

interface ResultsTabProps {
  cardId?: string;
  onSave?: () => void;
  isModified?: boolean;
  onFieldChange?: (field: string, value: any) => void;
}

export function ResultsTab({
  cardId,
  onSave,
  isModified,
  onFieldChange,
}: ResultsTabProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();
  const card = cardId ? getNodeById(cardId) : null;

  // Adapter function to match the v0 interface
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

  if (!card) return <></>;

  // Provide fallback values for targets since our card structure might be different
  const targets = {
    timeUnit: (card as any).targets?.timeUnit || "Monthly",
    targetValue: (card as any).targets?.targetValue || 0,
    currentValue: (card as any).targets?.currentValue || 0,
  };

  const progressPercentage =
    targets.targetValue > 0
      ? (targets.currentValue / targets.targetValue) * 100
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>OKR Targets</CardTitle>
              <CardDescription>
                Set and track your objectives and key results
              </CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Unit</label>
              <Select
                value={targets.timeUnit}
                onValueChange={(value: any) =>
                  updateCard({
                    targets: {
                      ...targets,
                      timeUnit: value,
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
              <label className="text-sm font-medium">Target Value</label>
              <Input
                type="number"
                value={targets.targetValue}
                onChange={(e) =>
                  updateCard({
                    targets: {
                      ...targets,
                      targetValue: Number.parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="Enter target value"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Value</label>
            <Input
              type="number"
              value={targets.currentValue}
              onChange={(e) =>
                updateCard({
                  targets: {
                    ...targets,
                    currentValue: Number.parseFloat(e.target.value) || 0,
                  },
                })
              }
              placeholder="Enter current value"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {targets.currentValue} of {targets.targetValue} (
              {targets.timeUnit.toLowerCase()})
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
