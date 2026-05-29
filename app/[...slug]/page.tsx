import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { BLOG_POSTS } from "@/lib/blog-data";
import { PAGES, getPageBySlug } from "@/lib/site-data";
import { EMERGENCY_PHONE_DISPLAY, SITE_NAME, absoluteUrl, phoneHref } from "@/lib/seo";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return PAGES.map((page) => ({ slug: page.slug.replace(/^\//, "").split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = `/${(await params).slug.join("/")}`;
  const page = getPageBySlug(route);
  if (!page) return { title: "Page Not Found" };
  const titleBase = `${page.primaryKeyword} ${page.targetArea} | ${SITE_NAME}`;
  const description = `${page.primaryKeyword} in ${page.targetArea}. Book fast inspection and lasting repair. Call ${EMERGENCY_PHONE_DISPLAY} for same-day foundation crack support.`;

  return {
    title: titleBase,
    description,
    alternates: { canonical: page.slug },
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    openGraph: {
      title: titleBase,
      description,
      url: absoluteUrl(page.slug),
      type: "article",
      siteName: SITE_NAME,
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const route = `/${(await params).slug.join("/")}`;
  const page = getPageBySlug(route);
  if (!page) notFound();
  const relatedByArea = PAGES.filter((candidate) => candidate.targetArea === page.targetArea && candidate.slug !== page.slug).slice(0, 8);
  const relatedBySection = PAGES.filter((candidate) => candidate.section === page.section && candidate.slug !== page.slug).slice(0, 8);
  const faqItems = [
    {
      q: `How quickly can I book ${page.primaryKeyword} in ${page.targetArea}?`,
      a: `Most homeowners can schedule an inspection quickly, especially when there is active seepage, widening cracks, or musty odours in the basement. When you call, we prioritize urgency, confirm the site details, and explain the fastest available repair window for ${page.targetArea}.`,
    },
    {
      q: `What repair method is used for ${page.primaryKeyword}?`,
      a: `The repair method depends on crack shape, moisture pressure, wall thickness, and long-term movement risk. For many poured concrete walls, epoxy or polyurethane injection is used, while some cases may require added waterproofing or structural reinforcement for dependable results.`,
    },
    {
      q: `Will the crack come back after repair?`,
      a: `A correctly diagnosed and professionally executed repair is designed for long-term performance. We also review drainage, grading, and moisture conditions around the home, because preventing recurring pressure is just as important as sealing the existing crack.`,
    },
  ];
  const pathParts = page.slug.replace(/^\//, "").split("/");
  const breadcrumbItems = pathParts.map((part, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    item: absoluteUrl(`/${pathParts.slice(0, index + 1).join("/")}`),
  }));

  return (
    <main className="shell section">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbItems }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: page.title, serviceType: page.primaryKeyword, areaServed: page.targetArea, provider: { "@type": "Organization", name: SITE_NAME }, url: absoluteUrl(page.slug) }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }} />

      <p className="pill">{page.pageType} • {page.searchIntent}</p>
      <h1>{page.title}</h1>
      <p className="lead">
        Need help with {page.primaryKeyword} in {page.targetArea}? If you are noticing wall cracking, water seepage, damp basement air, or recurring patch failure, this page will help you understand what to do next. Our process starts with a practical inspection so we can identify crack behavior, moisture pressure, and likely causes before recommending a repair. You get straightforward guidance, transparent scope, and a repair plan designed to protect your foundation, reduce future leak risk, and restore confidence in your home.
      </p>
      <div className="cta-row">
        <a className="btn btn-solid" href={phoneHref()}>Call {EMERGENCY_PHONE_DISPLAY}</a>
        <a className="btn btn-outline" href={phoneHref()}>Free Inspection</a>
      </div>

      <section className="section-sm">
        <h2>What This Service Covers</h2>
        <p className="lead">
          Every property and crack pattern is different. Our first step is identifying whether the crack is shrinkage-related,
          settlement-related, hydrostatic pressure related, or tied to drainage and grading conditions around the home.
          From there, we recommend a repair method that addresses both the symptom and the underlying cause.
        </p>
        <p className="lead">
          If your priority is stopping basement water entry, we focus on sealing active leak paths and stabilizing vulnerable
          wall sections. If your priority is long-term structural performance, we also discuss monitoring, reinforcement needs,
          and moisture management improvements to help prevent recurring damage.
        </p>
      </section>

      <section className="section-sm">
        <h2>Related Repair Topics</h2>
        <div className="tag-wrap">
          {page.secondaryKeywords.map((keyword) => <span key={keyword} className="tag">{keyword}</span>)}
        </div>
      </section>

      <section className="section-sm">
        <h2>Service Snapshot</h2>
        <div className="cluster-grid">
          <div className="cluster"><h3>Service Type</h3><p>{page.pageType || "Foundation Repair"}</p></div>
          <div className="cluster"><h3>Area Covered</h3><p>{page.targetArea}</p></div>
          <div className="cluster"><h3>Intent</h3><p>{page.searchIntent || "Inspection & Repair"}</p></div>
          <div className="cluster"><h3>Booking Priority</h3><p>{page.priority || "Standard"}</p></div>
        </div>
      </section>

      <section className="section-sm">
        <h2>Common Problems We Fix</h2>
        <div className="card-grid">
          {page.secondaryKeywords.slice(0, 6).map((keyword) => (
            <article className="card" key={keyword}>
              <p className="pill">Issue</p>
              <h3>{keyword}</h3>
              <p>
                This issue can lead to ongoing seepage, wall deterioration, and repeated patch failures if not repaired with
                the correct crack treatment method.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <h2>How Repair Works</h2>
        <div className="cluster-grid">
          <div className="cluster">
            <h3>1. Inspect</h3>
            <p>We assess crack type, depth, moisture activity, and likely root causes.</p>
          </div>
          <div className="cluster">
            <h3>2. Prepare</h3>
            <p>Surface preparation and access setup ensure a clean, lasting bond.</p>
          </div>
          <div className="cluster">
            <h3>3. Repair</h3>
            <p>Injection or sealing methods are selected based on crack behavior and wall condition.</p>
          </div>
          <div className="cluster">
            <h3>4. Protect</h3>
            <p>We share prevention steps to reduce repeat leaks and moisture pressure buildup.</p>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <h2>Helpful Reads</h2>
        <div className="card-grid">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
              <p className="pill">{post.readTime}</p>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <h2>More Services In {page.targetArea}</h2>
        <div className="list-grid">
          {relatedByArea.map((candidate) => (
            <a key={candidate.slug} href={candidate.slug} className="list-card">
              <strong>{candidate.targetArea}</strong>
              <span>{candidate.primaryKeyword}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <h2>Related Service Pages</h2>
        <div className="list-grid">
          {relatedBySection.map((candidate) => (
            <a key={candidate.slug} href={candidate.slug} className="list-card">
              <strong>{candidate.title}</strong>
              <span>{candidate.targetArea}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <h2>Frequently Asked Questions</h2>
        <div className="list-grid">
          {faqItems.map((faq) => (
            <article key={faq.q} className="list-card">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
