import { ConnectionsPanel } from '@/features/data/components/ConnectionsPanel';
import { EventsTaxonomyPanel } from '@/features/data/components/EventsTaxonomyPanel';
import { TrackedMetricsPanel } from '@/features/data/components/TrackedMetricsPanel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useState } from 'react';

// The Data hub — one home for everything feeding metrics: warehouse
// connections, the Tracked Metrics catalog (semantic layer), and the events
// taxonomy. Replaces the old mock "Source" page. Admin/config (API keys) lives
// in Workspace Settings.
export default function DataHubPage() {
  const [tab, setTab] = useState('connections');

  usePageHeader({
    title: 'Data',
    description: 'Connections, tracked metrics, and events taxonomy',
  });

  return (
    <div className="p-6 space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="metrics">Tracked Metrics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Warehouse connections</CardTitle>
              <CardDescription>
                Connections available to Source Nodes across this workspace. Add
                one from a Source Node’s warehouse config.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionsPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <TrackedMetricsPanel />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <EventsTaxonomyPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
