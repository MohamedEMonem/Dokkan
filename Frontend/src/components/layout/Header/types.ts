import type { ReactNode } from "react";

export interface SubItem {
  label: string;
  href: string;
}

export interface NavItemData {
  label: string;
  href: string;
  icon?: ReactNode;
  subItems?: SubItem[];
}
