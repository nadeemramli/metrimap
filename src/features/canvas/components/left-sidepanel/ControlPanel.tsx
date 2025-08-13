import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import type { Node } from '@xyflow/react';
import { format } from 'date-fns';
import {
  Calculator,
  Calendar as CalendarIcon,
  Code,
  Play,
  Settings,
  ToggleLeft,
  Type,
} from 'lucide-react';
import { useState } from 'react';

type OperatorNodeData = {
  label: string;
  operationType: 'formula' | 'boolean' | 'datePicker';
  isActive: boolean;
  formula?: string;
  booleanValue?: boolean;
  dateValue?: string;
};

interface ControlPanelProps {
  operatorNodes: Node<OperatorNodeData>[];
  onUpdateNode: (nodeId: string, updates: Partial<OperatorNodeData>) => void;
  onBulkUpdate: (updates: Partial<OperatorNodeData>) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export default function ControlPanel({
  operatorNodes,
  onUpdateNode,
  onBulkUpdate,
  onSimulate,
  isSimulating,
}: ControlPanelProps) {
  const [bulkFormula, setBulkFormula] = useState('');
  const [bulkBoolean, setBulkBoolean] = useState(false);
  const [bulkDate, setBulkDate] = useState<Date>();
  const [ifStatement, setIfStatement] = useState('');
  const [dynamicText, setDynamicText] = useState('');

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Simulate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onSimulate}
            disabled={isSimulating}
            className="w-full"
            variant={isSimulating ? 'secondary' : 'default'}
          >
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date Picker All
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bulkDate ? format(bulkDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={bulkDate}
                onSelect={setBulkDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() =>
              onBulkUpdate({
                operationType: 'datePicker',
                dateValue: bulkDate?.toISOString(),
              })
            }
            className="w-full mt-2"
            size="sm"
            disabled={!bulkDate}
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ToggleLeft className="w-4 h-4" />
            Toggle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch checked={bulkBoolean} onCheckedChange={setBulkBoolean} />
            <Label className="text-sm">{bulkBoolean ? 'True' : 'False'}</Label>
          </div>
          <Button
            onClick={() =>
              onBulkUpdate({
                operationType: 'boolean',
                booleanValue: bulkBoolean,
              })
            }
            className="w-full"
            size="sm"
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter formula (e.g., x * 2 + 1)"
            value={bulkFormula}
            onChange={(e) => setBulkFormula(e.target.value)}
          />
          <Button
            onClick={() =>
              onBulkUpdate({ operationType: 'formula', formula: bulkFormula })
            }
            className="w-full"
            size="sm"
            disabled={!bulkFormula}
          >
            Apply to All
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            If Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="if (x > 0) { return x * 2; } else { return 0; }"
            value={ifStatement}
            onChange={(e) => setIfStatement(e.target.value)}
            rows={3}
          />
          <Button
            onClick={() => onBulkUpdate({ formula: ifStatement })}
            className="w-full"
            size="sm"
            disabled={!ifStatement}
          >
            Apply Logic
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Operator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            onValueChange={(value: 'formula' | 'boolean' | 'datePicker') =>
              onBulkUpdate({ operationType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formula">Formula</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="datePicker">Date Picker</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={(checked) => onBulkUpdate({ isActive: checked })}
            />
            <Label className="text-sm">Enable All Operators</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Type className="w-4 h-4" />
            Dynamic Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter dynamic label"
            value={dynamicText}
            onChange={(e) => setDynamicText(e.target.value)}
          />
          <Button
            onClick={() => onBulkUpdate({ label: dynamicText || 'Operator' })}
            className="w-full"
            size="sm"
            disabled={!dynamicText}
          >
            Update Labels
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Individual Nodes</h3>
        {operatorNodes.map((node) => (
          <Card key={node.id} className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{node.data.label}</span>
              <Switch
                checked={node.data.isActive}
                onCheckedChange={(checked) =>
                  onUpdateNode(node.id, { isActive: checked })
                }
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Type: {node.data.operationType}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
