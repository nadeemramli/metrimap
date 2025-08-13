import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Clock,
  ShoppingCart,
  Shuffle,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface DataGeneratorProps {
  onDataComplete: (data: any[]) => void;
  onBack: () => void;
}

const dataTemplates = [
  {
    id: 'users',
    name: 'User Data',
    icon: <Users className="h-5 w-5" />,
    description: 'Generate user profiles with names, emails, ages, etc.',
    fields: ['id', 'name', 'email', 'age', 'city', 'signup_date'],
  },
  {
    id: 'sales',
    name: 'Sales Data',
    icon: <ShoppingCart className="h-5 w-5" />,
    description: 'Generate sales transactions and revenue data',
    fields: [
      'transaction_id',
      'product',
      'quantity',
      'price',
      'customer_id',
      'date',
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics Data',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Generate web analytics and event tracking data',
    fields: [
      'user_id',
      'event_name',
      'timestamp',
      'page_url',
      'session_id',
      'device',
    ],
  },
  {
    id: 'timeseries',
    name: 'Time Series',
    icon: <Clock className="h-5 w-5" />,
    description: 'Generate time-based data with trends and patterns',
    fields: ['timestamp', 'value', 'category', 'metric_name'],
  },
];

export default function DataGenerator({
  onDataComplete,
  onBack,
}: DataGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [rowCount, setRowCount] = useState(100);
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleData = (templateId: string, count: number) => {
    const generators: { [key: string]: () => any[] } = {
      users: () => generateUserData(count),
      sales: () => generateSalesData(count),
      analytics: () => generateAnalyticsData(count),
      timeseries: () => generateTimeSeriesData(count),
    };
    return generators[templateId]?.() || [];
  };

  const generateUserData = (count: number) => {
    const names = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Brown',
      'Charlie Wilson',
      'Diana Davis',
    ];
    const cities = [
      'New York',
      'San Francisco',
      'Chicago',
      'Boston',
      'Seattle',
      'Austin',
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      email: `user${i + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      city: cities[Math.floor(Math.random() * cities.length)],
      signup_date: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
    }));
  };

  const generateSalesData = (count: number) => {
    const products = ['Widget A', 'Widget B', 'Gadget X', 'Tool Y', 'Device Z'];
    return Array.from({ length: count }, (_, i) => ({
      transaction_id: `TXN${String(i + 1).padStart(6, '0')}`,
      product: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 10) + 1,
      price: Math.round((Math.random() * 200 + 10) * 100) / 100,
      customer_id: Math.floor(Math.random() * 1000) + 1,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }));
  };

  const generateAnalyticsData = (count: number) => {
    const events = [
      'page_view',
      'click',
      'scroll',
      'form_submit',
      'purchase',
      'signup',
    ];
    const pages = [
      '/home',
      '/products',
      '/about',
      '/contact',
      '/checkout',
      '/profile',
    ];
    const devices = ['desktop', 'mobile', 'tablet'];
    return Array.from({ length: count }, () => ({
      user_id: Math.floor(Math.random() * 500) + 1,
      event_name: events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      page_url: pages[Math.floor(Math.random() * pages.length)],
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      device: devices[Math.floor(Math.random() * devices.length)],
    }));
  };

  const generateTimeSeriesData = (count: number) => {
    const categories = ['revenue', 'users', 'orders', 'traffic'];
    const baseDate = new Date();
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(
        baseDate.getTime() - (count - i) * 24 * 60 * 60 * 1000
      );
      return {
        timestamp: date.toISOString().split('T')[0],
        value: Math.round((Math.random() * 1000 + 100) * 100) / 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        metric_name: `metric_${Math.floor(Math.random() * 5) + 1}`,
      };
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const data = generateSampleData(selectedTemplate, rowCount);
      setGeneratedData(data);
      setIsGenerating(false);
    }, 500);
  };

  const handleContinue = () => {
    onDataComplete(generatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Generate Sample Data</h2>
          <p className="text-gray-600">
            Choose a template and generate realistic sample data
          </p>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 4).map((field) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="text-xs"
                        >
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.fields.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {dataTemplates.find((t) => t.id === selectedTemplate)?.icon}
                  <CardTitle>
                    {dataTemplates.find((t) => t.id === selectedTemplate)?.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    onClick={() => setSelectedTemplate('')}
                    className="cursor-pointer"
                  >
                    Change
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rowCount">Number of Rows</Label>
                  <Select
                    value={rowCount.toString()}
                    onValueChange={(value) => setRowCount(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="50">50 rows</SelectItem>
                      <SelectItem value="100">100 rows</SelectItem>
                      <SelectItem value="500">500 rows</SelectItem>
                      <SelectItem value="1000">1,000 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={isGenerating}>
                <Shuffle className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Data'}
              </Button>
            </CardContent>
          </Card>

          {generatedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Data Preview</CardTitle>
                <Badge variant="secondary">
                  {generatedData.length} rows generated
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(generatedData[0] || {}).map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedData.slice(0, 10).map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <TableCell key={cellIndex} className="text-sm">
                              {value?.toString() || ''}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {generatedData.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing first 10 rows of {generatedData.length} total rows
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {generatedData.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue with Generated Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
