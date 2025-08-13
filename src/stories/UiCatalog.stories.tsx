import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/Catalog',
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div className="p-6 space-y-6">
      <div className="space-x-3">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm">Input</label>
        <Input placeholder="Type here" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>This is a simple card component.</CardContent>
      </Card>
    </div>
  ),
};
