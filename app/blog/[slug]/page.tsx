import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-data";
import { SITE_NAME, absoluteUrl, phoneHref, EMERGENCY_PHONE_DISPLAY } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      siteName: SITE_NAME,
      images: [{ url: absoluteUrl(post.image), alt: post.imageAlt }],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);

  return (
    <main className="shell section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: absoluteUrl(post.image),
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
          datePublished: post.publishedAt,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />

      <p className="pill">{post.readTime}</p>
      <h1>{post.title}</h1>
      <p className="lead">{post.excerpt}</p>

      <Image
        src={post.image}
        alt={post.imageAlt}
        width={1200}
        height={630}
        priority
        style={{ width: "100%", height: "auto", borderRadius: "1rem", marginTop: "1rem" }}
      />

      {post.sections.map((section) => (
        <section className="section-sm" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="lead">{paragraph}</p>
          ))}
        </section>
      ))}

      <section className="section-sm">
        <h2>Need Expert Help Instead of DIY?</h2>
        <p className="lead">
          If your basement is actively leaking or your crack is widening, call now for inspection-first guidance.
          We can help you prioritize the right repair path for your property.
        </p>
        <div className="cta-row">
          <a className="btn btn-solid" href={phoneHref()}>Call {EMERGENCY_PHONE_DISPLAY}</a>
          <Link className="btn btn-outline" href="/services">View Service Areas</Link>
        </div>
      </section>

      <section className="section-sm">
        <h2>Related Articles</h2>
        <div className="card-grid">
          {related.map((item) => (
            <article key={item.slug} className="card">
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <Link href={`/blog/${item.slug}`} className="btn btn-outline">Read Article</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
