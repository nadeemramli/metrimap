import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export function NotificationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure alert preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Email notifications</div>
            <div className="text-sm text-muted-foreground">
              Get notified of changes
            </div>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Data quality alerts</div>
            <div className="text-sm text-muted-foreground">
              Alert on data issues
            </div>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
