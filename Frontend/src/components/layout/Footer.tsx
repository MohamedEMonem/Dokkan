import { Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Brand icons (removed from lucide-react v1+) ───────────────────────────
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ─── Data ───────────────────────────────────────────────────────────────────
const COMPANY_NAME = "دكان";
const COMPANY_DESCRIPTION =
  "منصة التجارة الإلكترونية الموثوقة لبيع وشراء المنتجات عبر الإنترنت في مصر.";

const socialLinks = [
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

const footerSections = [
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

// ─── Reusable NavItem ────────────────────────────────────────────────────────
interface NavItemProps {
  label: string;
  href: string;
  route?: boolean;
}

function NavItem({ label, href, route }: NavItemProps) {
  const cls =
    "text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap";
  return (
    <li>
      {route ? (
        <Link className={cls} to={href}>
          {label}
        </Link>
      ) : (
        <a className={cls} href={href}>
          {label}
        </a>
      )}
    </li>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-text-dark text-white border-t mt-auto" dir="rtl">
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-start py-14! px-12! gap-12"
      >
        {/* Brand column */}
        <div className="flex-1 flex flex-col justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 mb-5!"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg text-white">{COMPANY_NAME}</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-6! max-w-70">
            {COMPANY_DESCRIPTION}
          </p>
          <div className="flex gap-5">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.ariaLabel}
                className="text-gray-400 hover:text-accent transition-colors"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full flex-2">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold text-base mb-5!">
                {section.header}
              </h4>
              <ul className="list-none flex flex-col gap-3">
                {section.links.map((link, i) => (
                  <NavItem
                    key={i}
                    label={link.label}
                    href={link.href}
                    route={link.route}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div
          className="max-w-7xl mx-auto text-center text-sm text-gray-400 py-6! px-12!"
        >
          <p>© {new Date().getFullYear()} دكان - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
