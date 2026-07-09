export const SITE_NAME = "Foundation Crack Pro";
export const DEFAULT_SITE_URL = "https://foundationcrackpro.com";
export const EMERGENCY_PHONE_DISPLAY = "1-888-896-5840";
export const EMERGENCY_PHONE_E164 = "+18888965840";

function normalizeSiteUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
    normalizeSiteUrl(process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
    DEFAULT_SITE_URL
  );
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path}`;
}

export function phoneHref(phone = EMERGENCY_PHONE_DISPLAY) {
  return `tel:${phone.replace(/[^0-9]/g, "")}`;
}
