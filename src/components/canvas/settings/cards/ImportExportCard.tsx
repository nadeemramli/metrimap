import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Download, FileText, Upload } from 'lucide-react';

export function ImportExportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>Manage your canvas data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Import Canvas Data
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Canvas Data
        </Button>
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}
