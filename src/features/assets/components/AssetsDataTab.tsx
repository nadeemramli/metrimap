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
import { useState } from 'react';

// The Data hub, folded into Assets: warehouse connections, the Tracked
// Metrics catalog (semantic layer), and the events taxonomy. Re-mounts the
// self-contained panels from features/data (which stay put); only the former
// standalone /data page went away.
export function AssetsDataTab() {
  const [tab, setTab] = useState('connections');

  return (
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
  );
}

export default AssetsDataTab;
