import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo";

const dmSans = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const sora = Sora({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Foundation Crack Repair Canada`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Foundation crack repair, basement crack injection, and waterproofing solutions across Canada.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Foundation Crack Repair Canada`,
    description: "Foundation crack repair and basement waterproofing pages built for modern local search.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable}`}>
      <body>
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
