import React, { createContext, useContext } from "react";

type PortalContainerContextValue = {
  container?: HTMLElement | null;
};

const PortalContainerContext = createContext<PortalContainerContextValue>({});

export function PortalContainerProvider({
  container,
  children,
}: React.PropsWithChildren<{ container?: HTMLElement | null }>) {
  return (
    <PortalContainerContext.Provider value={{ container }}>
      {children}
    </PortalContainerContext.Provider>
  );
}

export function usePortalContainer() {
  return useContext(PortalContainerContext);
}
