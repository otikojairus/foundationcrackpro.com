import Image from "next/image";
import Link from "next/link";
import { EMERGENCY_PHONE_DISPLAY, phoneHref, SITE_NAME } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            <Image
              src="/foundationcrackpro-logo.svg"
              alt={`${SITE_NAME} logo`}
              width={190}
              height={40}
              className="footer-brand-logo"
            />
          </Link>
          <p>Foundation crack repair, basement leak control, and inspection-first support for homeowners across Canada.</p>
        </div>
        <div>
          <h3>Navigation</h3>
          <p><Link href="/">Home</Link></p>
          <p><Link href="/services">Services</Link></p>
          <p><Link href="/blog">Blog</Link></p>
          <p><a href={phoneHref()}>Free Inspection Call</a></p>
        </div>
        <div>
          <h3>Emergency Line</h3>
          <p><a href={phoneHref()}>{EMERGENCY_PHONE_DISPLAY}</a></p>
          <p>Available for urgent leak and crack response.</p>
        </div>
      </div>
    </footer>
  );
}
