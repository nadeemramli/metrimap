import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface SourceConfigurationPanelProps {
  onConfigComplete: (
    config: Record<string, unknown>,
    data: Array<Record<string, string | number | null>>
  ) => void;
  onBack: () => void;
}

type DataRow = Record<string, string | number | null>;

export default function SourceConfigurationPanel({
  onConfigComplete,
  onBack,
}: SourceConfigurationPanelProps) {
  const [source, setSource] = useState<'warehouse' | 'csv' | 'sheets'>(
    'warehouse'
  );
  const [tableName, setTableName] = useState(
    'onboarding_events_and_users_join_'
  );
  const [rowLimit, setRowLimit] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<DataRow[]>([]);

  const columns = useMemo(
    () => (preview[0] ? Object.keys(preview[0]) : []),
    [preview]
  );

  const generatePreview = async () => {
    setIsLoading(true);
    // Simulate fetching a sample preview from the configured source
    setTimeout(() => {
      const rows: DataRow[] = [
        {
          'Level 1': 'screen_1',
          'Level 2': 'screen_2',
          'Level 3': 'screen_3',
          'Level 4': 'signup_action',
          'Level 5': 'signup_final',
          value: 1137,
        },
        {
          'Level 1': 'screen_1',
          'Level 2': 'screen_2',
          'Level 3': 'screen_3',
          'Level 4': 'login_action',
          'Level 5': 'login_final',
          value: 600,
        },
        {
          'Level 1': 'screen_1',
          'Level 2': 'screen_2',
          'Level 3': null,
          'Level 4': null,
          'Level 5': null,
          value: 549,
        },
        {
          'Level 1': 'screen_1',
          'Level 2': null,
          'Level 3': null,
          'Level 4': null,
          'Level 5': null,
          value: 470,
        },
        {
          'Level 1': 'screen_1',
          'Level 2': 'screen_2',
          'Level 3': 'screen_3',
          'Level 4': 'signup_action',
          'Level 5': null,
          value: 189,
        },
      ];
      setPreview(rows.slice(0, Math.max(1, Math.min(rowLimit, rows.length))));
      setIsLoading(false);
    }, 500);
  };

  const handleContinue = () => {
    onConfigComplete(
      {
        source,
        table: tableName,
        limit: rowLimit,
      },
      preview
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label className="mb-1 block">Source</Label>
          <Select value={source} onValueChange={(v) => setSource(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warehouse">Data Warehouse</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
              <SelectItem value="sheets">Google Sheets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label className="mb-1 block">Table</Label>
          <Input
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="schema.table_name"
          />
        </div>
        <div className="w-28">
          <Label className="mb-1 block">Limit</Label>
          <Input
            type="number"
            min={1}
            max={5000}
            value={rowLimit}
            onChange={(e) => setRowLimit(Number(e.target.value) || 1)}
          />
        </div>
        <div className="pb-0.5">
          <Button
            variant="outline"
            onClick={generatePreview}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading…' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
          <div className="text-sm font-medium">Preview</div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary">{preview.length} rows</Badge>
            <Badge variant="secondary">{columns.length} columns</Badge>
          </div>
        </div>
        <div className="max-h-64 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c} className="font-semibold text-xs">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c} className="text-xs">
                      {row[c] === null ? (
                        <span className="text-gray-400 italic">null</span>
                      ) : (
                        String(row[c])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={preview.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}
