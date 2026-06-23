import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_NAME, COMPANY_DESCRIPTION, socialLinks, footerSections } from "./data";
import FooterNavItem from "./FooterNavItem";

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white border-t border-gray-800 mt-auto" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg text-white">{COMPANY_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {COMPANY_DESCRIPTION}
            </p>
            <div className="flex gap-3">
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
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-4 text-lg">
                {section.header}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <FooterNavItem
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

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {COMPANY_NAME} - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
