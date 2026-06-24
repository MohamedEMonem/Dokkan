import { Mail } from "lucide-react";

// ─── Brand icons (removed from lucide-react v1+) ───────────────────────────
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const COMPANY_NAME = "دكان";
export const COMPANY_DESCRIPTION =
  "منصة التجارة الإلكترونية الموثوقة لبيع وشراء المنتجات عبر الإنترنت في مصر.";

export const socialLinks = [
  {
    icon: <FacebookIcon />,
    href: "https://facebook.com",
    ariaLabel: "Facebook",
  },
  { icon: <TwitterIcon />, href: "https://twitter.com", ariaLabel: "Twitter" },
  {
    icon: <InstagramIcon />,
    href: "https://instagram.com",
    ariaLabel: "Instagram",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    href: "mailto:info@dokkan.eg",
    ariaLabel: "Email",
  },
];

export const footerSections = [
  {
    header: "روابط سريعة",
    links: [
      { label: "الرئيسية", href: "/", route: true },
      { label: "جميع المنتجات", href: "/products", route: true },
      { label: "تصفح المتاجر", href: "/marketplace", route: true },
      { label: "اتصل بنا", href: "/contact", route: true },
    ],
  },
  {
    header: "للتجار",
    links: [
      {
        label: "كن تاجراً معنا",
        href: "/register?role=store-owner",
        route: true,
      },
      { label: "لوحة تحكم البائع", href: "/dashboard", route: true },
      { label: "دليل البائعين", href: "#" },
      { label: "مركز المساعدة", href: "#" },
    ],
  },
  {
    header: "القوانين",
    links: [
      { label: "شروط الخدمة", href: "#" },
      { label: "سياسة الخصوصية", href: "#" },
      { label: "سياسة ملفات الارتباط", href: "#" },
      { label: "سياسة الإرجاع", href: "#" },
    ],
  },
];
