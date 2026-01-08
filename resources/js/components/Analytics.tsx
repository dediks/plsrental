import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function PublicAnalytics(): null {
  const { url } = usePage();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    window.gtag("config", import.meta.env.VITE_GA_ID as string, {
      page_path: url,
    });
  }, [url]);

  return null;
}
