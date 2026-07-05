import React, { createContext, useContext } from "react";

type PortalContainerContextValue = {
  container?: HTMLElement | null;
};

const PortalContainerContext = createContext<PortalContainerContextValue>({});

export function PortalContainerProvider({
  container,
  children,
}: React.PropsWithChildren<{ container?: HTMLElement | null }>) {
  // Memoize the context value so it's a STABLE reference when `container` is
  // unchanged. Without this, every render handed consumers a new `{ container }`
  // object, so open dropdown/dialog/popover content (which portals INTO the
  // ReactFlow container) re-rendered on every canvas render — inside ReactFlow
  // that churned node dimensions → controlled-nodes update → re-render → React
  // #185 "Maximum update depth exceeded" (CVS-23/65).
  const value = React.useMemo(() => ({ container }), [container]);
  return (
    <PortalContainerContext.Provider value={value}>
      {children}
    </PortalContainerContext.Provider>
  );
}

export function usePortalContainer() {
  return useContext(PortalContainerContext);
}
