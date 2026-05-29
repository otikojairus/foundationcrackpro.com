import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Foundation Repair Blog | Foundation Crack Pro",
  description: "Guides on foundation cracks, basement leaks, injection repair, and cost planning for homeowners.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main className="shell section">
      <h1>Foundation Repair Blog</h1>
      <p className="lead">
        Practical homeowner guides on foundation crack diagnosis, basement leak prevention, repair planning,
        and long-term waterproofing habits. Use these articles to understand warning signs early, ask better
        questions during inspection, and choose repair steps that hold up over time.
      </p>

      <div className="card-grid">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="card">
            <Image src={post.image} alt={post.imageAlt} width={1200} height={630} style={{ width: "100%", height: "auto", borderRadius: "0.8rem" }} priority={false} />
            <p className="pill" style={{ marginTop: "0.75rem" }}>{post.readTime}</p>
            <h2 style={{ marginTop: "0.6rem" }}>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="btn btn-outline" style={{ marginTop: "0.7rem" }}>
              Read Article
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
