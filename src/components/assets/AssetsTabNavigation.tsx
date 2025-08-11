import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabType = 'metrics' | 'relationships';

interface Tab {
  id: TabType;
  label: string;
  count: number;
}

interface AssetsTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabs: Tab[];
}

export default function AssetsTabNavigation({
  activeTab,
  onTabChange,
  tabs,
}: AssetsTabNavigationProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TabType)}
      className="w-full"
    >
      <div className="mb-6">
        <TabsList className="bg-gray-100 rounded-lg p-[3px] shadow-sm w-fit h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 h-9 px-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent transition-all duration-300"
            >
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
