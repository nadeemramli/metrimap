// The settings section idiom shared with Workspace/Account settings —
// bordered card, icon + title row, optional description and header action.
export function Section({
  icon: Icon,
  title,
  description,
  action,
  destructive = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-lg border bg-card p-5 ${
        destructive ? 'border-destructive/40' : 'border-border'
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${destructive ? 'text-destructive' : 'text-primary'}`}
        />
        <h2 className="text-base font-semibold">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {description && (
        <p className="-mt-3 mb-4 text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
