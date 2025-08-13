import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ArrowUpDown, Filter, Group, Merge, Plus, X } from 'lucide-react';
import { useState } from 'react';

type TransformationType = 'filter' | 'groupby' | 'sort' | 'join';

interface BasicTransformation {
  id: string;
  type: TransformationType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
}

interface BasicTransformationPanelProps {
  columns: string[];
  onTransformationsChange: (transformations: BasicTransformation[]) => void;
  onSwitchToAdvanced: () => void;
}

export default function BasicTransformationPanel({
  columns,
  onTransformationsChange,
  onSwitchToAdvanced,
}: BasicTransformationPanelProps) {
  const [transformations, setTransformations] = useState<BasicTransformation[]>(
    []
  );

  const getDefaultConfig = (type: TransformationType) => {
    switch (type) {
      case 'filter':
        return { column: '', operator: 'equals', value: '' };
      case 'groupby':
        return { columns: [] as string[], aggregations: [] as string[] };
      case 'sort':
        return { column: '', direction: 'asc' as 'asc' | 'desc' };
      case 'join':
        return { table: '', joinType: 'inner', leftKey: '', rightKey: '' };
      default:
        return {};
    }
  };

  const addTransformation = (type: TransformationType) => {
    const newT: BasicTransformation = {
      id: Date.now().toString(),
      type,
      config: getDefaultConfig(type),
    };
    const updated = [...transformations, newT];
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  const removeTransformation = (id: string) => {
    const updated = transformations.filter((t) => t.id !== id);
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTransformation = (id: string, config: any) => {
    const updated = transformations.map((t) =>
      t.id === id ? { ...t, config } : t
    );
    setTransformations(updated);
    onTransformationsChange(updated);
  };

  const renderTransformationConfig = (t: BasicTransformation) => {
    switch (t.type) {
      case 'filter':
        return (
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={t.config.column}
              onValueChange={(value) =>
                updateTransformation(t.id, { ...t.config, column: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={t.config.operator}
              onValueChange={(value) =>
                updateTransformation(t.id, { ...t.config, operator: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={t.config.value}
              onChange={(e) =>
                updateTransformation(t.id, {
                  ...t.config,
                  value: e.target.value,
                })
              }
            />
          </div>
        );
      case 'groupby':
        return (
          <div className="space-y-2">
            <Label>Group by columns:</Label>
            <Select
              onValueChange={(value) =>
                updateTransformation(t.id, {
                  ...t.config,
                  columns: Array.from(
                    new Set([...(t.config.columns || []), value])
                  ),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select columns" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {Array.isArray(t.config.columns) && t.config.columns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {t.config.columns.map((c: string) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      case 'sort':
        return (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={t.config.column}
              onValueChange={(value) =>
                updateTransformation(t.id, { ...t.config, column: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={t.config.direction}
              onValueChange={(value) =>
                updateTransformation(t.id, { ...t.config, direction: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'join':
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Table"
              value={t.config.table}
              onChange={(e) =>
                updateTransformation(t.id, {
                  ...t.config,
                  table: e.target.value,
                })
              }
            />
            <Select
              value={t.config.joinType}
              onValueChange={(value) =>
                updateTransformation(t.id, { ...t.config, joinType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inner">Inner</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Left key"
              value={t.config.leftKey}
              onChange={(e) =>
                updateTransformation(t.id, {
                  ...t.config,
                  leftKey: e.target.value,
                })
              }
            />
            <Input
              placeholder="Right key"
              value={t.config.rightKey}
              onChange={(e) =>
                updateTransformation(t.id, {
                  ...t.config,
                  rightKey: e.target.value,
                })
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getIcon = (type: TransformationType) => {
    switch (type) {
      case 'filter':
        return <Filter className="h-4 w-4" />;
      case 'groupby':
        return <Group className="h-4 w-4" />;
      case 'sort':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'join':
        return <Merge className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Basic Transformations</h3>
        <Button variant="outline" size="sm" onClick={onSwitchToAdvanced}>
          Switch to Advanced
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation('filter')}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation('groupby')}
          className="flex items-center gap-2"
        >
          <Group className="h-4 w-4" />
          Group By
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation('sort')}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTransformation('join')}
          className="flex items-center gap-2"
        >
          <Merge className="h-4 w-4" />
          Join
        </Button>
      </div>

      <div className="space-y-3">
        {transformations.map((t, index) => (
          <Card key={t.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getIcon(t.type)}
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Step {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTransformation(t.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {renderTransformationConfig(t)}
            </CardContent>
          </Card>
        ))}
      </div>

      {transformations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Add your first transformation above
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
