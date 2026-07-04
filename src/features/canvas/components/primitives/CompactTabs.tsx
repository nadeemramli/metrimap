import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { cn } from '@/shared/utils';
import type { ReactNode } from 'react';

export interface CompactTab {
  value: string;
  label: ReactNode;
  icon?: React.ElementType;
  /** Optional inline content. Omit to render the panel yourself (controlled). */
  content?: ReactNode;
  disabled?: boolean;
}

interface CompactTabsProps {
  tabs: CompactTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
  /** Stretch the tab list to fill its width (equal-width triggers). */
  fill?: boolean;
}

/**
 * One consistent tab style across the canvas surfaces (CVS-158) — a thin
 * wrapper over the shadcn `Tabs` primitive so we stop hand-rolling `<button>`
 * tab bars. Pass `content` per tab for inline panels, or omit it and render the
 * active panel yourself (controlled `value`).
 */
export function CompactTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
  listClassName,
  fill,
}: CompactTabsProps) {
  const hasContent = tabs.some((t) => t.content != null);
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList className={cn(fill && 'w-full', listClassName)}>
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <TabsTrigger
              key={t.value}
              value={t.value}
              disabled={t.disabled}
              className={cn('gap-1.5', fill && 'flex-1')}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {t.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {hasContent &&
        tabs.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {t.content}
          </TabsContent>
        ))}
    </Tabs>
  );
}
