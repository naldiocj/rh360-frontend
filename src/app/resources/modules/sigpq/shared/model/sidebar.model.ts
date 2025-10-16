export interface SidebarItem {
    title: string;
    icon?: string;
    link?: string[];
    submenu?: SidebarItem[];
    permissions?: string[];
  }
  