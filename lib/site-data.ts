import dataset from "@/data/foundation-pages.generated.json";

export type FoundationPage = {
  title: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetArea: string;
  pageType: string;
  searchIntent: string;
  volumeMonthly: number | null;
  kd: number | null;
  cpc: number | null;
  priority: string;
  section: string;
};

export const PAGES = dataset.pages as FoundationPage[];
export const SECTIONS = dataset.sections;

export function getPageBySlug(slug: string) {
  return PAGES.find((page) => page.slug === slug);
}

export function getPagesBySection(section: string) {
  return PAGES.filter((page) => page.section === section);
}

export function getTopPages(limit = 12) {
  return PAGES.slice(0, limit);
}
