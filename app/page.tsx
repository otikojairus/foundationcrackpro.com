import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { BLOG_POSTS } from "@/lib/blog-data";
import { getTopPages } from "@/lib/site-data";
import { EMERGENCY_PHONE_DISPLAY, SITE_NAME, absoluteUrl, phoneHref } from "@/lib/seo";

export default function HomePage() {
  const topPages = getTopPages(9);
  function getServiceImage(keyword: string) {
    const k = keyword.toLowerCase();
    if (k.includes("foundation crack")) return "/services/foundation-crack-repair.jpg";
    if (k.includes("basement crack injection")) return "/services/basement-crack-injection.jpg";
    if (k.includes("basement crack")) return "/services/basement-crack-repair.jpg";
    if (k.includes("foundation waterproofing")) return "/services/foundation-waterproofing.jpg";
    if (k.includes("basement waterproofing")) return "/services/basement-waterproofing.jpg";
    if (k.includes("basement leak")) return "/services/basement-leak-repair.jpg";
    if (k.includes("wet basement")) return "/services/wet-basement-repair.jpg";
    if (k.includes("sump pump")) return "/services/sump-pump-installation.jpg";
    if (k.includes("foundation repair")) return "/services/foundation-repair.jpg";
    return "/services/foundation-repair.jpg";
  }

  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") }} />
      <section className="hero">
        <div className="shell">
          <p className="kicker">Crack Diagnostics + Injection Repair</p>
          <h1>Stop foundation leaks early with fast, long-lasting crack repair.</h1>
          <p className="lead">
            From hairline wall cracks to active basement seepage, our team helps you identify the root issue, repair it properly,
            and protect your home from repeat water damage. We start by understanding what you are seeing now, how long the crack
            has been present, and whether moisture is already entering your basement. Then we explain practical repair options in
            plain language, so you can make a confident decision quickly and prevent a small warning sign from becoming a major
            structural or waterproofing problem.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href={phoneHref()}>Call {EMERGENCY_PHONE_DISPLAY}</a>
            <Link className="btn btn-outline" href="/services">Explore Services Near You</Link>
          </div>
        </div>
      </section>

      <section className="shell section">
        <h2>Popular Repair Services</h2>
        <div className="card-grid">
          {topPages.map((page) => (
            <Link key={page.slug} href={page.slug} className="card">
              <Image
                src={getServiceImage(page.primaryKeyword || page.title)}
                alt={`${page.primaryKeyword} service in ${page.targetArea}`}
                width={1200}
                height={700}
                className="card-media"
              />
              <p className="pill">{page.pageType || "Service"}</p>
              <h3>{page.primaryKeyword || page.title}</h3>
              <p>Serving {page.targetArea}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section">
        <h2>How We Help Homeowners</h2>
        <div className="cluster-grid">
          <div className="cluster">
            <h3>Free Inspection Guidance</h3>
            <p>Get clear next steps based on your crack type and urgency.</p>
          </div>
          <div className="cluster">
            <h3>Basement Leak Solutions</h3>
            <p>Repair active seepage before it spreads into mold or structural issues.</p>
          </div>
          <div className="cluster">
            <h3>Permanent Injection Repairs</h3>
            <p>Epoxy and polyurethane crack injection options for concrete walls.</p>
          </div>
          <div className="cluster">
            <h3>Canada-Wide Coverage</h3>
            <p>Local service pages to help you find support in your city and province.</p>
          </div>
        </div>
      </section>

      <section className="shell section">
        <h2>From Our Blog</h2>
        <div className="card-grid">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
              <p className="pill">{post.readTime}</p>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn btn-outline" href="/blog">Read All Articles</Link>
        </div>
      </section>
    </main>
  );
}
