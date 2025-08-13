'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Database,
  Download,
  FileSpreadsheet,
  Globe,
  Play,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import BasicTransformationPanel from '../../node-function/source-node/basic-transformation-panel';
import DataGenerator from '../../node-function/source-node/data-generator';
import DataSourceSelector from '../../node-function/source-node/data-source-selector';
import ManualDataEntry from '../../node-function/source-node/manual-data-entry';
import SourceConfigurationPanel from '../../node-function/source-node/source-configuration-panel';
import TransformationModeSelector from '../../node-function/source-node/transformation-mode-selector';

interface DataRow {
  [key: string]: string | number | null;
}

interface DataTransformationNodeProps {
  nodeName?: string;
  initialCode?: string;
  initialData?: DataRow[];
  onDataTransform?: (transformedData: DataRow[]) => void;
}

const sampleData: DataRow[] = [
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
  {
    'Level 1': 'screen_1',
    'Level 2': 'screen_2',
    'Level 3': 'screen_3',
    'Level 4': 'login_action',
    'Level 5': null,
    value: 166,
  },
];

const defaultSQLCode = `WITH step_events AS (
  SELECT
    user_id,
    step,
    MIN(timestamp) AS step_time  -- first occurrence only
  FROM onboarding_events_and_users_join_
  WHERE step IN (
    'screen_1', 'screen_2', 'screen_3',
    'signup_action', 'signup_final',
    'login_action', 'login_final'
  )
)`;

export default function DataTransformationNode({
  nodeName = 'step_progression',
  initialCode = defaultSQLCode,
  initialData = sampleData,
  onDataTransform,
}: DataTransformationNodeProps) {
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState<DataRow[]>(initialData);
  const [activeTab, setActiveTab] = useState('sql');
  const [dataSource, setDataSource] = useState('warehouse');
  const [isRunning, setIsRunning] = useState(false);
  const [transformationMode, setTransformationMode] = useState<
    'basic' | 'advanced' | null
  >(null);
  const [basicTransformations, setBasicTransformations] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<
    'source' | 'transformation' | 'complete'
  >('source');
  const [dataSourceType, setDataSourceType] = useState<
    'sources' | 'manual' | 'generated' | null
  >(null);
  const [sourceData, setSourceData] = useState<DataRow[]>([]);

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      onDataTransform?.(data);
    }, 1000);
  };

  const getDataSourceIcon = () => {
    switch (dataSource) {
      case 'warehouse':
        return <Database className="h-4 w-4" />;
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'sheets':
        return <Globe className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Card className="w-full max-w-6xl mx-auto border-2 border-blue-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-700">
            {nodeName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  {getDataSourceIcon()}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">Data Warehouse</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="sheets">Google Sheets</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {currentStep === 'source' && !dataSourceType && (
          <DataSourceSelector
            onSourceSelect={(sourceType) => setDataSourceType(sourceType)}
            currentSource={dataSourceType}
          />
        )}

        {currentStep === 'source' && dataSourceType === 'sources' && (
          <SourceConfigurationPanel
            onConfigComplete={(config, data) => {
              setSourceData(data);
              setData(data);
              setCurrentStep('transformation');
            }}
            onBack={() => setDataSourceType(null)}
          />
        )}

        {currentStep === 'source' && dataSourceType === 'manual' && (
          <ManualDataEntry
            onDataComplete={(data) => {
              setSourceData(data);
              setData(data);
              setCurrentStep('transformation');
            }}
            onBack={() => setDataSourceType(null)}
          />
        )}

        {currentStep === 'source' && dataSourceType === 'generated' && (
          <DataGenerator
            onDataComplete={(data) => {
              setSourceData(data);
              setData(data);
              setCurrentStep('transformation');
            }}
            onBack={() => setDataSourceType(null)}
          />
        )}

        {currentStep === 'transformation' && !transformationMode && (
          <TransformationModeSelector
            onModeSelect={setTransformationMode}
            currentMode={transformationMode}
          />
        )}

        {currentStep === 'transformation' && transformationMode === 'basic' ? (
          <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <BasicTransformationPanel
                  columns={columns}
                  onTransformationsChange={setBasicTransformations}
                  onSwitchToAdvanced={() => setTransformationMode('advanced')}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {data.length} rows
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {columns.length} columns
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>

                <div className="border rounded-md h-[calc(100%-60px)] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column}
                            className="font-semibold text-xs"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column} className="text-xs">
                              {row[column] === null ? (
                                <span className="text-gray-400 italic">
                                  null
                                </span>
                              ) : (
                                row[column]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : currentStep === 'transformation' &&
          transformationMode === 'advanced' ? (
          // Original advanced mode content
          <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-3">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="sql">SQL</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransformationMode('basic')}
                    >
                      Switch to Basic
                    </Button>
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-[calc(100%-60px)]"
                >
                  <TabsContent value="sql" className="h-full">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="h-full font-mono text-sm resize-none border-gray-300"
                      placeholder="Enter your SQL query here..."
                    />
                  </TabsContent>

                  <TabsContent value="python" className="h-full">
                    <Textarea
                      value="# Python transformation code\nimport pandas as pd\n\n# Your data is available as 'df'\nresult = df.groupby(['Level 1', 'Level 2']).sum()"
                      onChange={(e) => setCode(e.target.value)}
                      className="h-full font-mono text-sm resize-none border-gray-300"
                      placeholder="Enter your Python code here..."
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {data.length} rows
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {columns.length} columns
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>

                <div className="border rounded-md h-[calc(100%-60px)] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column}
                            className="font-semibold text-xs"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column} className="text-xs">
                              {row[column] === null ? (
                                <span className="text-gray-400 italic">
                                  null
                                </span>
                              ) : (
                                row[column]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : null}
      </CardContent>
    </Card>
  );
}
