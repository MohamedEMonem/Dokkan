import {
  ShoppingCart,
  Heart,
  Store,
  Package,
  User,
  ShoppingBag,
} from "lucide-react";
import { NavItemData } from "./types";

export const navItems: NavItemData[] = [
  {
    label: "المنتجات",
    href: "/products",
    icon: <Package className="w-5 h-5 text-primary" />,
    subItems: [
      { label: "الإلكترونيات", href: "/products?cat=electronics" },
      { label: "الموضة والأزياء", href: "/products?cat=fashion" },
      { label: "المنزل والمعيشة", href: "/products?cat=home" },
      { label: "مستحضرات التجميل", href: "/products?cat=beauty" },
      { label: "الرياضة", href: "/products?cat=sports" },
      { label: "الكتب", href: "/products?cat=books" },
    ],
  },
  {
    label: "المحلات",
    href: "/stores",
    icon: <Store className="w-5 h-5 text-primary" />,
    subItems: [
      { label: "أفضل المتاجر", href: "/stores?sort=top" },
      { label: "المتاجر الجديدة", href: "/stores?sort=new" },
      { label: "متاجر موثوقة", href: "/stores?filter=verified" },
    ],
  },
];

export const iconActions = [
  {
    icon: <Heart className="w-5 h-5 text-text-dark" />,
    href: "/favorites",
    ariaLabel: "المفضلة",
    label: "المفضلة",
  },
  {
    icon: <ShoppingCart className="w-5 h-5 text-text-dark" />,
    href: "/cart",
    ariaLabel: "سلة التسوق",
    label: "سلة التسوق",
  },
];

export const userActions = [
  {
    label: "طلباتي",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "الملف الشخصي",
    href: "/profile",
    icon: User,
  },
];

export const navLinkVariant = (isActive: boolean) =>
  isActive
    ? "bg-linear-to-r from-primary to-primary-light text-white shadow-md transform scale-[1.02] [&>svg]:text-white"
    : "text-text-dark hover:bg-bg-cream hover:text-primary [&>svg]:text-primary";
