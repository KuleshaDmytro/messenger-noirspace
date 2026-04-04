import { createContext, useContext } from "react";

export type SidebarMenuView = 'none' | 'FriendRequest' | "AddAccount";

export type SidebarContextType = {

    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;

    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    anchorEl: HTMLElement | null

    activeMenuView: SidebarMenuView;
    setActiveMenuView: (view: SidebarMenuView) => void;
};

export const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebarContext must be used within SidebarContext.Provider');
  }
  return ctx;
};
