export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  publishedAt: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "vertical-vs-horizontal-foundation-cracks",
    title: "Vertical vs Horizontal Foundation Cracks: What Homeowners Should Know",
    excerpt: "Learn which crack patterns are often cosmetic and which may signal structural pressure or moisture risk.",
    image: "/blog/foundation-crack-patterns.jpg",
    imageAlt: "Illustration of vertical and horizontal foundation cracks",
    readTime: "7 min read",
    publishedAt: "2026-05-29",
    sections: [
      {
        heading: "Why Crack Direction Matters",
        paragraphs: [
          "Foundation cracks are not all the same. The direction of a crack can reveal whether your home is experiencing normal concrete shrinkage, soil movement, lateral pressure, or water intrusion. Understanding the pattern helps you avoid under-treating a serious issue or overpaying for repairs that are not necessary.",
          "Vertical cracks are often linked to normal curing or minor settlement, while horizontal cracks can indicate pressure from saturated soil pushing against basement walls. Diagonal cracks can point to differential settlement that should be reviewed quickly."
        ]
      },
      {
        heading: "When To Call Immediately",
        paragraphs: [
          "If you notice widening cracks, bowing walls, active water seepage, or repeated re-cracking after previous patching, it is best to book a professional inspection right away. Fast diagnosis can prevent moisture damage, mold growth, and further structural stress.",
          "You should also act quickly if doors and windows near cracked walls start sticking, or if you see white mineral deposits and damp odours in the basement. These signs often appear together when moisture pressure is increasing."
        ]
      },
      {
        heading: "Practical Next Steps",
        paragraphs: [
          "Start by documenting crack width, length, and location with photos. Track whether the crack changes over time and whether moisture appears after rain or snowmelt. This information helps your technician recommend the right repair method faster.",
          "A professional plan may include epoxy or polyurethane injection, drainage correction, grading improvements, or wall reinforcement depending on root cause. The goal is always long-term stability, not a temporary cosmetic fix."
        ]
      }
    ]
  },
  {
    slug: "why-basement-leaks-return-after-diy-patching",
    title: "Why Basement Leaks Return After DIY Patching",
    excerpt: "Surface sealants can hide symptoms temporarily, but they often fail when water pressure remains unresolved.",
    image: "/blog/diy-basement-repair.jpg",
    imageAlt: "Homeowner applying patch to a basement wall crack",
    readTime: "6 min read",
    publishedAt: "2026-05-29",
    sections: [
      {
        heading: "The Main Problem With Surface Patches",
        paragraphs: [
          "Many DIY products seal only the visible surface of a crack. If hydrostatic pressure continues behind the wall, water finds another path and the leak returns. This creates frustration and can increase repair cost later if moisture spreads to flooring or framing.",
          "A lasting fix usually requires understanding how deep the crack runs, whether the crack is moving, and how water is building pressure around the foundation."
        ]
      },
      {
        heading: "What Lasting Repair Looks Like",
        paragraphs: [
          "Professional crack repair typically includes full crack preparation, injection of the right material for conditions, and guidance on drainage control around the property. In some cases, interior repair should be paired with exterior grading or downspout improvements to reduce repeat moisture load.",
          "When moisture patterns are seasonal, your inspection should account for freeze-thaw cycles and spring melt behavior in your city."
        ]
      },
      {
        heading: "How To Avoid Repeat Costs",
        paragraphs: [
          "Ask for a root-cause explanation, not just a quote. You should know whether the issue is shrinkage, settlement, pressure, or drainage-related before work begins.",
          "Choosing a repair strategy that addresses both the crack and the water source is the best way to avoid repeated service calls and recurring basement dampness."
        ]
      }
    ]
  },
  {
    slug: "foundation-crack-repair-cost-canada",
    title: "Foundation Crack Repair Cost in Canada: What Affects Pricing",
    excerpt: "Get a clear breakdown of factors that influence repair cost, from crack type to accessibility and moisture severity.",
    image: "/blog/foundation-repair-cost.jpg",
    imageAlt: "Cost estimate worksheet for foundation crack repair",
    readTime: "8 min read",
    publishedAt: "2026-05-29",
    sections: [
      {
        heading: "Cost Drivers Homeowners Should Understand",
        paragraphs: [
          "Foundation crack repair costs vary because no two properties have identical crack behavior or site access. Pricing is commonly affected by crack length and width, whether the crack is actively leaking, and how easy it is to prepare and inject safely.",
          "Multiple cracks across different walls may require staged repair. If moisture has already impacted insulation, drywall, or flooring, restoration costs can be separate from crack sealing work."
        ]
      },
      {
        heading: "Why Inspection Quality Matters",
        paragraphs: [
          "A rushed quote without a clear diagnosis can lead to mismatched repair methods. Good inspections evaluate structural movement risk, moisture pressure, and the long-term performance expected from each repair option.",
          "The right upfront assessment can save money by preventing rework and helping you prioritize urgent repairs first."
        ]
      },
      {
        heading: "Planning Your Budget",
        paragraphs: [
          "If your home has had recurring leaks, include budget room for drainage improvements and moisture prevention around the foundation perimeter. Even small grading or downspout corrections can improve long-term outcomes.",
          "Ask for a scope that explains immediate repair, recommended follow-up, and prevention steps so you can make decisions with confidence."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
