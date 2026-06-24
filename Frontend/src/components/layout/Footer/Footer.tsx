import { Store, MapPin, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  COMPANY_NAME,
  COMPANY_DESCRIPTION,
  socialLinks,
  footerSections,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
} from "./data";
import FooterNavItem from "./FooterNavItem";
import { useListStoresQuery } from "@/api/store.api";

export default function Footer() {
  const location = useLocation();

  // Extract subdomain from URL path since useParams() is empty in parent layout components
  const decodedPath = decodeURIComponent(location.pathname);
  const pathParts = decodedPath.split("/");
  const subdomain = pathParts[1];

  const isStoreRoute = !!subdomain && subdomain.startsWith("@");
  const cleanSubdomain = isStoreRoute ? subdomain.slice(1) : "";

  const { data: storeResponse, isLoading: isStoreLoading } = useListStoresQuery(
    { subdomain: cleanSubdomain },
    { skip: !isStoreRoute }
  );

  const store = storeResponse?.data?.stores?.[0];

  if (isStoreRoute) {
    if (isStoreLoading || !store) {
      return (
        <footer className="bg-gradient-to-br from-[#2B2B2B] to-[#1A1A1A] text-white py-12 mt-16 animate-pulse" dir="rtl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Skeleton */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full" />
                  <div className="w-32 h-6 bg-white/10 rounded" />
                </div>
                <div className="w-full h-4 bg-white/10 rounded mb-2" />
                <div className="w-2/3 h-4 bg-white/10 rounded" />
              </div>
              {/* Contact Skeleton */}
              <div>
                <div className="w-24 h-6 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                  <div className="w-1/2 h-4 bg-white/10 rounded" />
                  <div className="w-2/3 h-4 bg-white/10 rounded" />
                  <div className="w-3/4 h-4 bg-white/10 rounded" />
                </div>
              </div>
              {/* Follow Skeleton */}
              <div>
                <div className="w-16 h-6 bg-white/10 rounded mb-4" />
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <div className="w-48 h-4 bg-white/10 rounded mx-auto" />
            </div>
          </div>
        </footer>
      );
    }

    return (
      <footer className="bg-gradient-to-br from-[#2B2B2B] to-[#1A1A1A] text-white py-12 mt-16" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 (Brand) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Store className="w-6 h-6 text-[#005B7F]" />
                  )}
                </div>
                <h3 className="text-xl font-bold">{store.name}</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {store.description || "أفضل متجر إلكتروني لبيع وشراء المنتجات عبر الإنترنت في مصر."}
              </p>
            </div>

            {/* Column 2 (Contact Us) */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">تواصل معنا</h4>
              <div className="space-y-3 text-sm text-white/80">
                {store.businessAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{store.businessAddress}</span>
                  </div>
                )}
                {store.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span dir="ltr">{store.phoneNumber}</span>
                  </div>
                )}
                {store.supportEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{store.supportEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3 (Follow Us) */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">تابعنا</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} {store.name}. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    );
  }

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

