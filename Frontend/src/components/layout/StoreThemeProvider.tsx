import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useListStoresQuery } from "@/api/store.api";
import { adjustColorBrightness } from "@/utils/themeUtils";

interface StoreThemeProviderProps {
  children: React.ReactNode;
}

export default function StoreThemeProvider({ children }: StoreThemeProviderProps) {
  const { subdomain } = useParams<{ subdomain: string }>();
  const isStoreRoute = !!subdomain && subdomain.startsWith("@");
  const cleanSubdomain = isStoreRoute ? subdomain.slice(1) : "";

  const { data: storeResponse } = useListStoresQuery(
    { subdomain: cleanSubdomain },
    { skip: !isStoreRoute }
  );

  const store = storeResponse?.data?.stores?.[0];

  // Derive dynamic CSS variables
  const themeStyles = useMemo(() => {
    const themeSettingsData = store?.themeSettings || (store as any)?.theme_settings;

    if (!isStoreRoute) {
      return {};
    }

    let settings = themeSettingsData;
    if (typeof settings === "string") {
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        console.error("StoreTheme: Failed to parse themeSettings JSON string:", e);
        settings = {};
      }
    }

    const typedSettings = (settings || {}) as { primaryColor?: string; bgColor?: string };
    const styles: Record<string, string> = {};  

    // Default primary color to #1A1A1A if not set on store route
    const primaryColor = typedSettings.primaryColor || "#1A1A1A";
    styles["--color-primary"] = primaryColor;
    // Derive hovers and active states dynamically (e.g. +/- 15% brightness)
    styles["--color-primary-light"] = adjustColorBrightness(primaryColor, 15);
    styles["--color-primary-dark"] = adjustColorBrightness(primaryColor, -15);

    // Default bg color to #FFFFFF if not set on store route
    const bgColor = typedSettings.bgColor || "#FFFFFF";
    styles["--color-bg-cream"] = bgColor;
    // Also override warm background color to match the store background
    styles["--color-bg-warm"] = bgColor;

    console.log("StoreTheme: Resolved dynamic styles:", styles);
    return styles as React.CSSProperties;
  }, [isStoreRoute, store]);

  return (
    <div style={themeStyles} className="min-h-screen flex flex-col w-full">
      {children}
    </div>
  );
}
