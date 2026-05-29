import Link from "next/link";
import { SECTIONS, getPagesBySection } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <main className="shell section">
      <h1>Foundation Crack Repair Services</h1>
      <p className="lead">
        Find the right repair service for your issue, whether you are dealing with basement wall cracks, active water seepage,
        repeated dampness, or long-term structural concerns. This page is designed to help you quickly navigate to the exact
        repair type and location page that matches your situation. Each service page explains what the issue means, which repair
        methods are usually recommended, and how to move forward if you need urgent support. If you are unsure where to start,
        begin with the location closest to you and book an inspection call.
      </p>

      {SECTIONS.map((section) => {
        const pages = getPagesBySection(section);
        if (!pages.length) return null;

        return (
          <section key={section} className="section-sm">
            <h2>{section}</h2>
            <div className="list-grid">
              {pages.map((page) => (
                <Link key={page.slug} href={page.slug} className="list-card">
                  <strong>{page.targetArea}</strong>
                  <span>{page.primaryKeyword}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="section-sm">
        <h2>Learning Center</h2>
        <div className="card-grid">
          <article className="card">
            <p className="pill">Prevention</p>
            <h3>5 Signs Your Foundation Needs Immediate Attention</h3>
            <p>Spot early warning signs before cracks become expensive structural repairs.</p>
          </article>
          <article className="card">
            <p className="pill">Inspection</p>
            <h3>What To Expect During a Foundation Crack Inspection</h3>
            <p>Understand how technicians evaluate crack severity, movement, and moisture entry points.</p>
          </article>
          <article className="card">
            <p className="pill">Maintenance</p>
            <h3>How to Keep Repaired Foundation Walls Dry Year-Round</h3>
            <p>Simple drainage and grading practices that protect your basement after repairs.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
