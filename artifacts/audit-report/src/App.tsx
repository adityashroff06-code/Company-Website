import { useState } from "react";

const SCORES = {
  design: 32,
  ux: 28,
  positioning: 35,
  marketing: 22,
  seo: 18,
  trust: 30,
  performance: 45,
  overall: 30,
};

const SECTIONS = [
  "Overview",
  "Positioning",
  "Homepage",
  "Features",
  "UX",
  "Design",
  "SEO",
  "Content",
  "Trust",
  "Lead Gen",
  "Technical",
  "Competitor Gaps",
  "Roadmap",
];

function ScoreGauge({ label, score }: { label: string; score: number }) {
  const color =
    score >= 70
      ? "bg-green-500"
      : score >= 50
      ? "bg-yellow-500"
      : score >= 35
      ? "bg-orange-500"
      : "bg-red-500";
  const textColor =
    score >= 70
      ? "text-green-600"
      : score >= 50
      ? "text-yellow-600"
      : score >= 35
      ? "text-orange-600"
      : "text-red-600";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </span>
        <span className={`text-2xl font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        {score < 35
          ? "Critical — needs immediate attention"
          : score < 50
          ? "Poor — significant work required"
          : score < 70
          ? "Fair — notable improvements needed"
          : "Good — minor polish needed"}
      </p>
    </div>
  );
}

function SeverityBadge({ level }: { level: "Critical" | "High" | "Medium" | "Low" }) {
  const map = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    High: "bg-orange-100 text-orange-700 border-orange-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[level]}`}>
      {level}
    </span>
  );
}

function FindingCard({
  title,
  severity,
  detail,
  fix,
}: {
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  detail: string;
  fix?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <SeverityBadge level={severity} />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
      {fix && (
        <div className="mt-1 bg-blue-50 rounded p-3 text-xs text-blue-800 border border-blue-100">
          <span className="font-semibold">Fix: </span>
          {fix}
        </div>
      )}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="font-bold text-red-800 text-lg mb-2">Verdict: Not Ready for Market</h3>
        <p className="text-red-700 text-sm leading-relaxed">
          ProductArmor.com is critically underdeveloped compared to every competitor analysed. The homepage opens with a
          YouTube video that autoplays a corporate intro with no headline, no CTA, and no product information visible
          above the fold. A buyer landing on this site today would have no idea what to do next. The site has effectively
          zero SEO footprint, no trust signals, no content strategy, and no lead-generation infrastructure. All five
          competitors — including ones with far smaller operations — outperform it on every single dimension measured.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreGauge label="Design" score={SCORES.design} />
          <ScoreGauge label="UX" score={SCORES.ux} />
          <ScoreGauge label="Positioning" score={SCORES.positioning} />
          <ScoreGauge label="Marketing" score={SCORES.marketing} />
          <ScoreGauge label="SEO" score={SCORES.seo} />
          <ScoreGauge label="Trust" score={SCORES.trust} />
          <ScoreGauge label="Performance" score={SCORES.performance} />
          <ScoreGauge label="Overall Readiness" score={SCORES.overall} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Most Urgent Problems</h3>
        <div className="flex flex-col gap-3">
          <FindingCard
            title="Hero section is a YouTube video with no text"
            severity="Critical"
            detail="Visitors see a playing video and a logo. No headline explains what the company does or who it's for. No call-to-action exists. First impressions are lost in seconds."
            fix="Replace the full-screen YouTube embed with a structured hero: company tagline, 1-sentence value prop, product category keywords, and a primary CTA button ('Request a Sample' or 'Get a Quote')."
          />
          <FindingCard
            title="No SEO foundation whatsoever"
            severity="Critical"
            detail="The site has no detectable meta title pattern, no meta descriptions, no structured heading hierarchy, no keyword targeting, and no blog or landing pages. It is essentially invisible to search engines for any commercial query."
            fix="Write unique meta titles and descriptions for every page. Create landing pages for key product categories (HDPE bottles, CR caps, CT caps). Start a blog with technical content."
          />
          <FindingCard
            title="Zero lead generation mechanisms"
            severity="Critical"
            detail="There is no enquiry form, no quote request form, no demo booking, no downloadable spec sheet, no newsletter signup, no WhatsApp button, and no live chat. A buyer who wants to engage has to go hunting for a contact page."
            fix="Add a prominent 'Request a Quote' form on the homepage. Add a WhatsApp sticky button. Add a product catalogue PDF download gated with an email capture."
          />
          <FindingCard
            title="No trust signals"
            severity="Critical"
            detail="No certifications are displayed (no ISO, no USDMF, no WHO-GMP badges), no client logos, no testimonials, no case studies, no awards, and no third-party validation of any kind."
            fix="Certifications, client logos and one testimonial can be added in a single afternoon. These have outsized impact on B2B conversion."
          />
          <FindingCard
            title="Navigation is nearly empty"
            severity="High"
            detail="The navigation appears to only expose 2 slides. No Products page, no About, no Quality, no Certifications, no Contact. Competitors have 6–9 top-level pages with dropdown sub-navigation."
            fix="Build out a full navigation with: Home, Products (dropdown by category), About Us, Quality & Certifications, Sustainability, Contact."
          />
        </div>
      </div>
    </div>
  );
}

function PositioningSection() {
  const competitors = [
    {
      name: "Product Armor",
      problem: "Unclear — site doesn't articulate a specific problem it solves",
      audience: "Pharmaceutical manufacturers (implied, never stated)",
      uvp: "'Controlled Variables, Specified Outcomes' — abstract and unmemorable",
      differentiators: "Sustainability focus (not highlighted), cross-industry team",
      score: "2/10",
    },
    {
      name: "Pravesha",
      problem: "Pharmaceutical companies need reliable, compliant end-to-end packaging",
      audience: "Pharma companies globally",
      uvp: "One-Stop Shop for all packaging needs, DMF certified, award-winning",
      differentiators: "Award winner, holography & anti-counterfeiting, podcast/blog",
      score: "8/10",
    },
    {
      name: "East Pharma",
      problem: "Need for ISO cleanroom-manufactured primary/secondary pharma packaging",
      audience: "Pharma manufacturers needing regulatory compliance",
      uvp: "One stop shop — ISO 7&8 cleanroom, 7 ISO certifications including USDMF",
      differentiators: "Cleanroom manufacturing, USDMF registration",
      score: "7/10",
    },
    {
      name: "Mold-Tek",
      problem: "Need for high-quality, innovatively designed rigid plastic packaging",
      audience: "Pharma, paints, lubricants, food & FMCG brands",
      uvp: "39 years, market leader, BSE/NSE listed, 100% backward integrated",
      differentiators: "Publicly listed, backward integration, IML printing technology",
      score: "9/10",
    },
    {
      name: "Shriji Polymers",
      problem: "Need for consistent, sustainable plastic packaging globally",
      audience: "Multi-sector buyers (India, China, USA)",
      uvp: "Global footprint with consistency, sustainability and protection focus",
      differentiators: "India + China + USA presence, dedicated R&D team",
      score: "7/10",
    },
    {
      name: "Triveni Polychem",
      problem: "PVC formulation additive supply for polymer manufacturers",
      audience: "Polymer / PVC manufacturers",
      uvp: "Preferred polymer additive distributor since 2004",
      differentiators: "Niche PVC additive specialist (different category)",
      score: "5/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-orange-800 text-sm leading-relaxed">
          <strong>Core Problem:</strong> Product Armor has no clearly stated product positioning. The tagline "Controlled
          Variables, Specified Outcomes" is engineering jargon that means nothing to a procurement officer. Pravesha's
          "One-Stop Shop for All Your Packaging Needs" communicates instant, clear value. Product Armor needs to rewrite
          its entire positioning from scratch.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[120px]">Company</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[180px]">Problem Solved</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[150px]">Target Audience</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[200px]">UVP</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[180px]">Key Differentiators</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">Score</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className={i === 0 ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className={`p-3 border border-gray-200 font-semibold ${i === 0 ? "text-red-700" : "text-gray-800"}`}>
                  {i === 0 ? "★ " : ""}{c.name}
                </td>
                <td className="p-3 border border-gray-200 text-gray-700">{c.problem}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{c.audience}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{c.uvp}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{c.differentiators}</td>
                <td className={`p-3 border border-gray-200 font-bold ${i === 0 ? "text-red-600" : "text-green-700"}`}>
                  {c.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-900 mb-2">Recommended New Positioning</h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Headline:</strong> "Pharmaceutical-Grade HDPE Packaging for Regulated Markets"<br />
          <strong>Sub-headline:</strong> "ISO-certified HDPE bottles, child-resistant closures and CT caps — manufactured
          under controlled conditions, delivered on time."<br />
          <strong>Target:</strong> Pharma manufacturers, API producers, contract research organizations in India and export
          markets.<br />
          <strong>CTA:</strong> "Request a Sample Kit" or "Get a Quote in 24 Hours"
        </p>
      </div>
    </div>
  );
}

function HomepageSection() {
  const comparisons = [
    {
      element: "Hero Section",
      pa: "Full-screen YouTube video playing on loop. No text, no headline visible.",
      pravesha: "Striking product photography with bold overlaid headlines, 5 rotating slides",
      east: "Company name typography over product images with subheadline on certifications",
      moldtek: "Stats bar (39 yrs, 9 ISO units, BSE/NSE listed) + building photography",
      verdict: "FAIL",
    },
    {
      element: "Hero Headline",
      pa: "None visible",
      pravesha: '"One-Stop Shop For All Your Packaging Needs"',
      east: '"One stop shop — your primary & secondary packaging expert"',
      moldtek: '"The Power of Packaging Unleashed" with 39-year context',
      verdict: "FAIL",
    },
    {
      element: "Call-to-Action",
      pa: "None",
      pravesha: "Multiple CTAs per slide",
      east: "Sticky CONTACT button in nav bar",
      moldtek: "'Read More' per section + CONTACT in nav",
      verdict: "FAIL",
    },
    {
      element: "Trust Elements",
      pa: "None visible on homepage",
      pravesha: "Award badge, certification logos, client count",
      east: "7 ISO certification numbers listed prominently",
      moldtek: "BSE/NSE listing, 39-year badge, ISO badge",
      verdict: "FAIL",
    },
    {
      element: "Testimonials",
      pa: "None",
      pravesha: "None visible on homepage",
      east: "None",
      moldtek: "None visible",
      verdict: "WEAK ACROSS BOARD",
    },
    {
      element: "Product Explanation",
      pa: "Small paragraph below video — only visible if user scrolls past the video",
      pravesha: "Clear product category tiles with descriptions",
      east: "Product thumbnails with read-more links",
      moldtek: "Product category banners with links",
      verdict: "FAIL",
    },
    {
      element: "Pricing Visibility",
      pa: "None",
      pravesha: "None (B2B standard)",
      east: "None",
      moldtek: "None",
      verdict: "N/A — B2B norm",
    },
    {
      element: "Navigation",
      pa: "2 slide dots only — no visible nav menu",
      pravesha: "7 top-level items incl. Regulatory, Sustainability, Blogs, Podcast",
      east: "6 items: Home, About, Products, Facilities, Quality, Career + Contact CTA",
      moldtek: "7 items: Company, Products, Technology, Innovations, Investors, News, Contact + language toggle",
      verdict: "FAIL",
    },
    {
      element: "Visual Hierarchy",
      pa: "Flat — video dominates everything, no hierarchy",
      pravesha: "Strong — headline → product promise → proof",
      east: "Moderate — certifications lead before products",
      moldtek: "Strong — credibility metrics → story → products",
      verdict: "FAIL",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-800 text-sm leading-relaxed">
          <strong>Summary:</strong> The Product Armor homepage fails on 8 of 9 dimensions. The decision to make the hero
          a YouTube video is the single most damaging design choice. It creates a slow load, provides no SEO value,
          communicates no message, and gives the visitor no reason to stay. Every competitor uses this prime real estate
          for product positioning and conversion. This needs to be rebuilt from scratch.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[130px]">Element</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 bg-red-50 min-w-[180px]">Product Armor</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[160px]">Pravesha</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[160px]">East Pharma</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[160px]">Mold-Tek</th>
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200 min-w-[100px]">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border border-gray-200 font-medium text-gray-800">{row.element}</td>
                <td className="p-3 border border-gray-200 text-red-700 bg-red-50">{row.pa}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{row.pravesha}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{row.east}</td>
                <td className="p-3 border border-gray-200 text-gray-700">{row.moldtek}</td>
                <td className={`p-3 border border-gray-200 font-bold text-xs ${row.verdict === "FAIL" ? "text-red-600" : row.verdict.includes("WEAK") ? "text-orange-600" : "text-gray-500"}`}>
                  {row.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      feature: "Dedicated Products Page with Category Breakdown",
      pa: false,
      pravesha: true,
      east: true,
      moldtek: true,
      shriji: true,
      gap: "Major gap — buyers can't see what you sell",
      recommendation: "Create a Products page with HDPE Bottles, CR Caps, CT Caps categories and individual product pages",
      priority: "High",
    },
    {
      feature: "Quote / Enquiry Form",
      pa: false,
      pravesha: true,
      east: true,
      moldtek: true,
      shriji: true,
      gap: "No way for buyers to initiate contact",
      recommendation: "Add a quote form with fields: product type, quantity, specs, company, email",
      priority: "High",
    },
    {
      feature: "Certifications Page / Badges",
      pa: false,
      pravesha: true,
      east: true,
      moldtek: true,
      shriji: true,
      gap: "Critical trust gap for pharma buyers",
      recommendation: "Dedicate a 'Quality & Certifications' page. Display all cert badges on homepage",
      priority: "High",
    },
    {
      feature: "About Us / Company Story Page",
      pa: "Partial",
      pravesha: true,
      east: true,
      moldtek: true,
      shriji: true,
      gap: "No structured company story or team section",
      recommendation: "Build a proper About page with founding story, team, mission, facility photos",
      priority: "High",
    },
    {
      feature: "Facilities / Infrastructure Page",
      pa: false,
      pravesha: true,
      east: true,
      moldtek: true,
      shriji: true,
      gap: "Buyers want to see manufacturing environment",
      recommendation: "Add Facilities page with photos, machine list, cleanroom specs, production capacity",
      priority: "High",
    },
    {
      feature: "Blog / Knowledge Centre",
      pa: false,
      pravesha: true,
      east: false,
      moldtek: false,
      shriji: true,
      gap: "Zero content marketing; no SEO long-tail coverage",
      recommendation: "Start a blog. 2 posts/month on topics: CR cap regulations, HDPE sustainability, pharma packaging trends",
      priority: "High",
    },
    {
      feature: "WhatsApp / Live Chat Widget",
      pa: false,
      pravesha: false,
      east: false,
      moldtek: false,
      shriji: false,
      gap: "Low friction contact missing",
      recommendation: "Add a WhatsApp Business sticky button (trivial to implement, high ROI for Indian B2B)",
      priority: "Medium",
    },
    {
      feature: "Sustainability / ESG Section",
      pa: "Mentioned in text",
      pravesha: true,
      east: false,
      moldtek: false,
      shriji: true,
      gap: "Sustainability is mentioned but not showcased",
      recommendation: "Build a proper Sustainability page with your specific initiatives, metrics, goals",
      priority: "Medium",
    },
    {
      feature: "Case Studies / Customer Stories",
      pa: false,
      pravesha: false,
      east: false,
      moldtek: false,
      shriji: false,
      gap: "None across the board",
      recommendation: "Even 1-2 anonymised case studies ('A top-10 Indian pharma company reduced rejection rate by X%') would be highly differentiating",
      priority: "Medium",
    },
    {
      feature: "Client Logo Gallery",
      pa: false,
      pravesha: true,
      east: false,
      moldtek: true,
      shriji: true,
      gap: "Social proof completely absent",
      recommendation: "Display 8-12 client logos (with permission). If NDA-bound, use 'Trusted by 50+ pharmaceutical companies'",
      priority: "High",
    },
    {
      feature: "Product Spec Downloads (PDF)",
      pa: false,
      pravesha: false,
      east: false,
      moldtek: false,
      shriji: false,
      gap: "Huge differentiating opportunity",
      recommendation: "Create downloadable product data sheets with dimensions, materials, regulatory compliance",
      priority: "Medium",
    },
    {
      feature: "Multi-language Support",
      pa: false,
      pravesha: false,
      east: false,
      moldtek: true,
      shriji: false,
      gap: "Limited for export markets",
      recommendation: "Add language toggle for top export markets if relevant",
      priority: "Low",
    },
    {
      feature: "Career / Jobs Page",
      pa: false,
      pravesha: false,
      east: true,
      moldtek: false,
      shriji: false,
      gap: "Modest SEO and brand-building value",
      recommendation: "Add simple careers page if actively hiring",
      priority: "Low",
    },
    {
      feature: "Regulatory / Compliance Page",
      pa: false,
      pravesha: true,
      east: false,
      moldtek: false,
      shriji: false,
      gap: "Pravesha differentiates heavily on this",
      recommendation: "A 'Regulatory Compliance' page covering WHO-GMP, USDMF, EU GMP etc. directly addresses pharma buyer concerns",
      priority: "High",
    },
    {
      feature: "Anti-Counterfeiting / Holography",
      pa: false,
      pravesha: true,
      east: false,
      moldtek: false,
      shriji: false,
      gap: "Premium differentiator if offered",
      recommendation: "If not a service, consider partnering. If offered, highlight prominently",
      priority: "Low",
    },
  ];

  const priorityColor = (p: string) =>
    p === "High" ? "text-red-600 font-semibold" : p === "Medium" ? "text-orange-600" : "text-blue-600";

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[160px]">Feature</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 bg-red-50 min-w-[90px]">Product Armor</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">Pravesha</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">East Pharma</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">Mold-Tek</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">Shriji</th>
              <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[180px]">Gap</th>
              <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[220px]">Recommendation</th>
              <th className="text-center p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[80px]">Priority</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-2.5 border border-gray-200 font-medium text-gray-800">{f.feature}</td>
                <td className="p-2.5 border border-gray-200 bg-red-50 text-center">
                  {f.pa === false ? (
                    <span className="text-red-500 font-bold text-base">✗</span>
                  ) : f.pa === true ? (
                    <span className="text-green-500 font-bold text-base">✓</span>
                  ) : (
                    <span className="text-yellow-500 font-bold text-xs">~</span>
                  )}
                </td>
                {[f.pravesha, f.east, f.moldtek, f.shriji].map((v, j) => (
                  <td key={j} className="p-2.5 border border-gray-200 text-center">
                    {v ? (
                      <span className="text-green-500 font-bold text-base">✓</span>
                    ) : (
                      <span className="text-gray-300 font-bold text-base">✗</span>
                    )}
                  </td>
                ))}
                <td className="p-2.5 border border-gray-200 text-gray-600">{f.gap}</td>
                <td className="p-2.5 border border-gray-200 text-gray-700">{f.recommendation}</td>
                <td className={`p-2.5 border border-gray-200 text-center ${priorityColor(f.priority)}`}>{f.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UXSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="User Journey: Broken from the first second"
          severity="Critical"
          detail="The user journey is: land on site → see a video → scroll → see a vague 'Who We Are' paragraph → reach dead end. There is no path to product discovery, no path to contact, no path to conversion. A buyer with intent to purchase packaging has zero way to progress."
          fix="Map out 3 buyer journeys (discovery, validation, purchase) and ensure each has a clear path through the site."
        />
        <FindingCard
          title="Clicks to Primary Action: Undefined"
          severity="Critical"
          detail="There is no primary action defined, so clicks to it cannot be counted. Competitors have 'Contact' or 'Get a Quote' accessible in 1 click from the navigation. Product Armor requires the user to somehow find a contact method with no guidance."
          fix="Put a 'Request a Quote' CTA button in the top navigation (right side) and repeat it in the hero. Primary action must be 1 click away."
        />
        <FindingCard
          title="Mobile Responsiveness: Untested / likely broken"
          severity="High"
          detail="The site relies on a full-screen YouTube embed as the hero. On mobile, embedded YouTube videos often break aspect ratios, auto-play restrictions cause blank screens, and the absence of text means mobile users see nothing useful. The slide-dot navigation is not thumb-friendly."
          fix="Rebuild the homepage with a mobile-first approach. Test on iOS Safari, Android Chrome, and tablet viewports."
        />
        <FindingCard
          title="Forms: None exist"
          severity="Critical"
          detail="There are no forms on the site. No contact form, no quote form, no enquiry form, no newsletter form. This is the single most common conversion mechanism in B2B and it is completely absent."
          fix="Add a multi-step quote form and a simple contact form. Use a service like Formspree or build a backend endpoint."
        />
        <FindingCard
          title="Navigation: Invisible"
          severity="Critical"
          detail="The navigation appears to be limited to two slide indicator dots. There is no hamburger menu, no header nav, no footer nav. Users have no site structure to orient themselves."
          fix="Implement a sticky header with full navigation. Add a comprehensive footer with all key pages, certifications, and contact info."
        />
        <FindingCard
          title="Accessibility: Unknown / likely failing"
          severity="High"
          detail="No alt text visible on images, no skip-to-content link, no ARIA labels, unclear focus states, contrast likely fails WCAG AA on the grey video overlay sections. The site likely scores below 50 on Lighthouse accessibility."
          fix="Run a Lighthouse audit. Add alt text to all images. Ensure text contrast meets 4.5:1 ratio. Add proper ARIA labels."
        />
        <FindingCard
          title="Readability: Poor"
          severity="High"
          detail="The single visible paragraph ('We are a multi-disciplinary team of scientists, artists, businessmen, architects, army commandos, pilots, engineers and chemists...') tries so hard to be impressive that it loses all clarity. 'Army commandos and pilots' in a pharmaceutical packaging context is confusing, not differentiated."
          fix="Rewrite all copy at F8 reading level. Lead with what you do and who it's for, not metaphorical team descriptions."
        />
        <FindingCard
          title="Performance: Video-heavy load"
          severity="Medium"
          detail="Loading a YouTube video iframe on page load introduces significant third-party script overhead, layout shift, and loading time — particularly on slow Indian mobile connections."
          fix="Remove the video hero. If video is retained elsewhere, lazy-load it. Use a video thumbnail with play button instead of autoplay embed."
        />
      </div>
    </div>
  );
}

function DesignSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="Colors: Bland corporate default"
          severity="High"
          detail="The site uses a grey gradient background for the video hero and a navy/steel-blue for the logo. There is no discernible brand colour palette applied to UI elements, CTAs, headings, or sections. The site looks unfinished — like a template that was never styled."
          fix="Define a 3-colour brand palette (primary, accent, neutral). Apply it consistently to CTAs, section backgrounds, headings, and icons. The current blue in the logo is a good starting point for the primary."
        />
        <FindingCard
          title="Typography: No hierarchy visible"
          severity="High"
          detail="There is no typographic hierarchy — no clear H1, H2, H3 distinction. Body text is the only text visible below the video. No contrasting font weights, no heading sizes, no visual scale."
          fix="Set a clear type scale: H1 (2.5–3rem, bold), H2 (1.75rem, semibold), H3 (1.25rem, medium), body (1rem, regular). Use a professional system font like Inter or Nunito."
        />
        <FindingCard
          title="Layout: One section"
          severity="Critical"
          detail="The homepage has effectively one section: the video. There is no multi-section layout with alternating content, no feature grid, no testimonial strip, no stats bar. Competitors average 6–8 homepage sections."
          fix="Design a structured homepage: Hero → Key Stats → Products → Why Choose Us → Certifications → Clients → Contact CTA."
        />
        <FindingCard
          title="White Space: Absent (not in a good way)"
          severity="Medium"
          detail="White space is either completely absent (content is cramped in the visible paragraph) or entirely dominant (the full-screen empty video). There is no deliberate use of space to guide the eye."
          fix="Use generous padding (40–80px section padding) and consistent spacing between elements. Let the design breathe without being empty."
        />
        <FindingCard
          title="Icons: None"
          severity="Medium"
          detail="No icons are used anywhere on the site. Competitors use product category icons, feature icons, and trust badge icons to break up text and improve scannability."
          fix="Add SVG icons for product categories (bottle, cap, closure), features (sustainability, quality, delivery), and certifications."
        />
        <FindingCard
          title="Images: Only the video and one product slider image"
          severity="High"
          detail="Product imagery is virtually absent. The one visible slider image shows a product photo, but there are no professional product photography sections, no facility shots, no team photos, no infographics."
          fix="Invest in professional product photography. 10–15 high-quality product images and 5–6 facility shots transform the credibility of a B2B site."
        />
        <FindingCard
          title="Branding Consistency: None to evaluate"
          severity="High"
          detail="The logo is strong (custom 'P' letterform in navy). The logo tagline 'Controlled Variables, Specified Outcomes' is set in a clean sans-serif. Beyond the logo, zero brand guidelines are applied to the rest of the site."
          fix="Create a brand style guide (colours, typography, tone of voice) and apply it consistently across all pages, documents and social."
        />
      </div>
    </div>
  );
}

function SEOSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-800 text-sm leading-relaxed">
          <strong>SEO Score: 18/100 — Catastrophic.</strong> ProductArmor.com is effectively invisible to search
          engines. It cannot rank for any commercial query. While Pravesha, Mold-Tek and East Pharma have established
          SEO foundations, Product Armor starts from zero. This is a multi-month gap to close.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="Meta Titles: Non-existent or auto-generated"
          severity="Critical"
          detail="The page title appears to be auto-generated or empty — no keyword-optimised title pattern. Search engines will display whatever they find, likely the domain name."
          fix={`Write unique title tags: "HDPE Pharmaceutical Bottles & CR Caps Manufacturer India | Product Armor"`}
        />
        <FindingCard
          title="Meta Descriptions: None"
          severity="Critical"
          detail="No meta description tags detected. Google will auto-generate snippets from page content — but the page content is a video, so there is almost nothing to extract."
          fix="Write compelling 150–160 character meta descriptions for every page that include target keywords and a value proposition."
        />
        <FindingCard
          title="Heading Hierarchy: Broken"
          severity="Critical"
          detail="The heading structure is flat or absent. The YouTube video has no associated H1. The visible 'What we do' and 'Who We Are' subheadings are not structured with proper H1/H2/H3 tags."
          fix="Every page needs exactly one H1 (main keyword phrase). Use H2 for section headings, H3 for subsections. Never skip levels."
        />
        <FindingCard
          title="Keywords: Zero targeting"
          severity="Critical"
          detail="No keyword research appears to have informed any page content. Terms like 'HDPE pharmaceutical bottles', 'child resistant caps manufacturer India', 'CT caps supplier', 'WHO-GMP packaging' are completely absent from visible content."
          fix="Research 20–30 target keywords using Google Keyword Planner. Map them to specific pages. Include in headings, body copy, alt text, meta data."
        />
        <FindingCard
          title="Internal Linking: None"
          severity="High"
          detail="With only a handful of pages and no navigation links, there is no internal link structure. This prevents Google from crawling and understanding the site hierarchy."
          fix="Create a proper sitemap. Ensure every page links to at least 2–3 related pages. Add a footer with links to all key pages."
        />
        <FindingCard
          title="Page Speed: Degraded by video"
          severity="High"
          detail="The YouTube embed adds 400–800ms to initial load time on desktop and significantly more on mobile. Third-party YouTube scripts, layout shift, and blocked rendering all harm Core Web Vitals."
          fix="Run PageSpeed Insights. Remove the video hero. Optimise all images. Aim for LCP under 2.5s, CLS under 0.1."
        />
        <FindingCard
          title="Structured Data: None"
          severity="Medium"
          detail="No Schema.org markup for Organisation, Product, or LocalBusiness. Competitors with structured data get enhanced search snippets."
          fix="Add Organisation schema with NAP (Name, Address, Phone), Product schema for each product category, and BreadcrumbList schema."
        />
        <FindingCard
          title="Image Optimisation: Unknown / likely poor"
          severity="Medium"
          detail="Images appear to be JPGs with unknown compression. No WebP, no lazy loading, no descriptive file names, no alt text."
          fix="Convert all images to WebP. Add descriptive file names ('hdpe-pharmaceutical-bottle-manufacturer.webp'). Add keyword-rich alt text to every image."
        />
      </div>
    </div>
  );
}

function ContentSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="Clarity: Very low"
          severity="Critical"
          detail="'We are a multi-disciplinary team of scientists, artists, businessmen, architects, army commandos, pilots, engineers, and chemists adopting the best learnings from various industries...' This sentence is 47 words long and says nothing about what you sell."
          fix="Rewrite every paragraph with the '1-sentence rule': if a paragraph can't be summarised in one sentence, split it. Lead every section with the key message, not the context."
        />
        <FindingCard
          title="Grammar: Acceptable but inconsistent"
          severity="Low"
          detail="No obvious grammatical errors in visible text, but capitalization is inconsistent ('End-to-end a' appears to be a truncated sentence). Copy reads like it was written by engineers, not marketers."
          fix="Have all copy reviewed by a professional copywriter or native English speaker with B2B marketing experience."
        />
        <FindingCard
          title="Value Proposition: Buried and abstract"
          severity="Critical"
          detail="The only articulated value proposition is 'Controlled Variables, Specified Outcomes' — a tagline that could apply to a laboratory instrument, a project management tool, or a pharmaceutical packaging company. It means nothing to a buyer."
          fix="Test 3 value propositions with actual customers. Pick the one that drives the most 'that's exactly what I need' reactions. Make it the hero headline."
        />
        <FindingCard
          title="Product Explanation: Inadequate"
          severity="High"
          detail="HDPE bottles and CR caps are mentioned in one paragraph. There are no product specifications, no size options, no material grades, no colour options, no MOQ information, no compliance information."
          fix="Create dedicated product pages for each category with full specs, photos, technical drawings, compliance information, and enquiry CTA."
        />
        <FindingCard
          title="FAQs: None"
          severity="High"
          detail="No FAQ section exists. Buyers in pharma packaging have very specific questions: What certifications do you hold? What is your minimum order quantity? What lead times? What testing do you perform? These are all unanswered."
          fix="Create an FAQ page with 15–20 questions that your sales team is most commonly asked. This also has significant SEO value."
        />
        <FindingCard
          title="Case Studies: None"
          severity="High"
          detail="No case studies or customer success stories exist anywhere on the site. Mold-Tek and Pravesha both reference client relationships and industry recognition."
          fix="Even 1 brief case study ('How we helped a Hyderabad pharma company reduce packaging rejections by 23%') adds enormous credibility."
        />
        <FindingCard
          title="Blog: None"
          severity="High"
          detail="No blog exists. Pravesha has a Blog and a Podcast. A blog is the most cost-effective way to build organic search traffic and establish thought leadership in the pharma packaging space."
          fix="Launch a blog with 2 posts/month. Topics: CR cap regulatory requirements, HDPE vs PET in pharma, sustainability in pharmaceutical packaging, quality control in HDPE manufacturing."
        />
        <FindingCard
          title="Customer Stories: None"
          severity="Medium"
          detail="No testimonials, no client quotes, no reference customers. This is a significant trust gap that all competitors also partially share, but Product Armor doesn't even try."
          fix="Collect 3–5 written testimonials from existing clients. Even a first name and company type ('Procurement Head, Top-10 Indian Pharma') is sufficient."
        />
      </div>
    </div>
  );
}

function TrustSection() {
  const items = [
    { item: "ISO Certifications displayed", pa: false, pravesha: true, east: true, moldtek: true },
    { item: "USDMF / GMP certification", pa: false, pravesha: true, east: true, moldtek: false },
    { item: "Awards / Recognition", pa: false, pravesha: true, east: false, moldtek: true },
    { item: "Client logos", pa: false, pravesha: true, east: false, moldtek: true },
    { item: "Testimonials", pa: false, pravesha: false, east: false, moldtek: false },
    { item: "Security badges (SSL visible)", pa: "unknown", pravesha: true, east: true, moldtek: true },
    { item: "Privacy Policy", pa: false, pravesha: "unknown", east: "unknown", moldtek: "unknown" },
    { item: "Terms & Conditions", pa: false, pravesha: "unknown", east: "unknown", moldtek: "unknown" },
    { item: "Contact info (phone/email visible)", pa: false, pravesha: true, east: true, moldtek: true },
    { item: "Company registration / years in business", pa: false, pravesha: false, east: false, moldtek: true },
    { item: "Physical address", pa: false, pravesha: true, east: true, moldtek: true },
    { item: "LinkedIn / Social links", pa: false, pravesha: false, east: false, moldtek: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-800 text-sm leading-relaxed">
          <strong>Trust Score: 30/100.</strong> Pharmaceutical packaging is a high-stakes, compliance-driven category.
          Buyers must be 100% confident that their packaging supplier is certified, auditable, and reliable. Product
          Armor displays none of the standard trust signals that pharma procurement teams look for. A buyer comparing
          Product Armor to Pravesha or East Pharma would choose competitors immediately based on trust signals alone —
          before even evaluating price or product specs.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Trust Element</th>
              <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200 bg-red-50">Product Armor</th>
              <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Pravesha</th>
              <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">East Pharma</th>
              <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Mold-Tek</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => {
              const render = (val: boolean | string) =>
                val === true ? (
                  <span className="text-green-500 font-bold text-base">✓</span>
                ) : val === false ? (
                  <span className="text-red-500 font-bold text-base">✗</span>
                ) : (
                  <span className="text-yellow-500 text-xs font-medium">?</span>
                );
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium text-gray-800">{row.item}</td>
                  <td className="p-3 border border-gray-200 bg-red-50 text-center">{render(row.pa)}</td>
                  <td className="p-3 border border-gray-200 text-center">{render(row.pravesha)}</td>
                  <td className="p-3 border border-gray-200 text-center">{render(row.east)}</td>
                  <td className="p-3 border border-gray-200 text-center">{render(row.moldtek)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadGenSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-800 text-sm leading-relaxed">
          <strong>Lead Generation Score: 0/10.</strong> There is literally no lead generation mechanism on the site. Not
          a single form, not a phone number displayed prominently, not a chat widget, not a downloadable asset with email
          gate. The site is generating zero leads from organic or paid traffic.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="CTA Placement: Zero CTAs"
          severity="Critical"
          detail="No call-to-action buttons exist on the homepage or in the navigation. There is no 'Get a Quote', 'Contact Us', 'Request a Sample', or 'Download Catalogue' button anywhere visible."
          fix="Add a primary CTA button to: (1) top-right nav, (2) hero section, (3) end of each page section, (4) floating mobile CTA. Make it orange or red for visibility."
        />
        <FindingCard
          title="Quote / Enquiry Form: Missing"
          severity="Critical"
          detail="No enquiry form exists. B2B buyers expect to be able to submit a quote request online, 24/7, without having to call or email blindly."
          fix="Build a quote request form: Name, Company, Email, Phone, Product Interest (dropdown), Quantity Required, Message. Auto-send acknowledgement email."
        />
        <FindingCard
          title="Demo Booking: Not applicable / missing"
          severity="Medium"
          detail="No mechanism for scheduling a factory visit, product discussion, or sample request."
          fix="Add a 'Schedule a Factory Visit' or 'Request a Sample' flow — even a simple Calendly embed for sales calls."
        />
        <FindingCard
          title="Live Chat / WhatsApp: None"
          severity="High"
          detail="No live chat, no WhatsApp button, no chatbot. Triveni Polychem, a far smaller company, has WhatsApp integration. Indian B2B buyers heavily use WhatsApp for vendor communication."
          fix="Add a WhatsApp Business sticky button immediately. Cost: zero. Implementation: 30 minutes."
        />
        <FindingCard
          title="Newsletter / Email Capture: None"
          severity="Low"
          detail="No newsletter subscription. Less critical for B2B, but useful for re-engaging site visitors."
          fix="Add a simple 'Stay updated on pharma packaging news' email signup in the footer."
        />
        <FindingCard
          title="Downloads / Lead Magnets: None"
          severity="High"
          detail="No downloadable product catalogue, technical specifications, or compliance documentation. These are high-value lead generation assets in B2B."
          fix="Create a 'Product Catalogue PDF' gated behind an email form. Buyers who download it are qualified leads."
        />
      </div>
    </div>
  );
}

function TechnicalSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FindingCard
          title="SSL / HTTPS: Appears active"
          severity="Low"
          detail="The site appears to serve over HTTPS (productarmor.com). This is a baseline requirement — met."
          fix="Verify HTTPS is enforced with HSTS headers and that HTTP redirects to HTTPS."
        />
        <FindingCard
          title="Mobile Rendering: Likely broken"
          severity="Critical"
          detail="The hero YouTube embed is almost certainly broken on mobile — either shows a black screen, breaks layout, or fails to autoplay (iOS Safari blocks autoplay). The slide dots navigation is not thumb-friendly."
          fix="Test on real iOS and Android devices. Rebuild hero without YouTube dependency. Ensure minimum tap target size of 44x44px."
        />
        <FindingCard
          title="YouTube Embed: Performance & reliability risk"
          severity="High"
          detail="Embedding YouTube as the hero creates: (1) Third-party script loading overhead, (2) Layout shift (CLS failures), (3) Privacy concerns for GDPR-relevant visitors, (4) Dependency on YouTube availability, (5) Autoplay blocked on mobile."
          fix="Remove YouTube embed from hero. Move video to a dedicated 'Company' or 'About' page with a lazy-loaded embed."
        />
        <FindingCard
          title="Page Weight / Speed: Unknown but likely poor"
          severity="High"
          detail="The YouTube embed alone loads Google APIs, YouTube player scripts, and multiple network requests on every homepage load. No evidence of image optimisation, lazy loading, or minification."
          fix="Run Google PageSpeed Insights. Target 90+ on desktop, 70+ on mobile. Compress all assets."
        />
        <FindingCard
          title="JavaScript Errors: Unknown"
          severity="Medium"
          detail="No visibility into JS errors without browser dev tools audit. The slide navigation with only 2 dots suggests possible JS logic for a carousel that may have partial errors."
          fix="Open browser console and check for JS errors. Audit with Sentry or similar error tracking tool."
        />
        <FindingCard
          title="Broken Links: Risk exists"
          severity="Medium"
          detail="With minimal navigation and pages, broken links are less of a risk. However, any social links, external references, or document downloads may be broken."
          fix="Run Screaming Frog or Google Search Console crawl to identify broken links. Fix all 404s."
        />
        <FindingCard
          title="robots.txt & sitemap.xml: Unknown"
          severity="High"
          detail="No evidence of a submitted sitemap. Without a sitemap, search engines may not crawl all pages, particularly if internal linking is poor (which it is)."
          fix="Generate and submit an XML sitemap to Google Search Console. Verify robots.txt is not accidentally blocking crawlers."
        />
        <FindingCard
          title="Analytics: Unknown if configured"
          severity="High"
          detail="No evidence of Google Analytics or any analytics platform. Without this, there is no data on traffic sources, bounce rate, or user behaviour."
          fix="Install Google Analytics 4 and Google Search Console immediately. These are free and essential for understanding site performance."
        />
      </div>
    </div>
  );
}

function CompetitorGapsSection() {
  const quickWins = [
    { task: "Add WhatsApp Business sticky button", effort: "2 hours", impact: "High — immediate lead capture channel", priority: "High" },
    { task: "Write and add meta titles + descriptions to all pages", effort: "1 day", impact: "High — essential for SEO indexing", priority: "High" },
    { task: "Add contact email and phone number prominently in header/footer", effort: "2 hours", impact: "High — basic trust signal", priority: "High" },
    { task: "Add ISO certification badges to homepage", effort: "4 hours", impact: "High — critical trust for pharma buyers", priority: "High" },
    { task: "Install Google Analytics 4 and Search Console", effort: "2 hours", impact: "High — baseline measurement", priority: "High" },
    { task: "Add alt text to all existing images", effort: "2 hours", impact: "Medium — SEO and accessibility", priority: "Medium" },
    { task: "Add Privacy Policy page", effort: "4 hours", impact: "Medium — legal requirement, trust signal", priority: "Medium" },
    { task: "Add physical address and map embed to contact section", effort: "2 hours", impact: "Medium — local SEO and trust", priority: "Medium" },
    { task: "Add LinkedIn profile link in footer", effort: "1 hour", impact: "Low — social proof, recruiting", priority: "Low" },
    { task: "Create and submit XML sitemap", effort: "2 hours", impact: "Medium — SEO crawling", priority: "Medium" },
  ];

  const highImpact = [
    { task: "Rebuild homepage hero (remove YouTube, add headline + CTA + product imagery)", effort: "1–2 weeks dev", impact: "Very High — fixes the #1 conversion killer" },
    { task: "Build full Products section with individual product pages", effort: "2–3 weeks", impact: "Very High — enables product discovery and SEO" },
    { task: "Build quote/enquiry form with email notification", effort: "1 week", impact: "Very High — direct revenue impact" },
    { task: "Build and launch blog with 5 seed articles", effort: "3–4 weeks", impact: "High — long-term organic traffic" },
    { task: "Create Quality & Certifications page with cert images", effort: "1 week", impact: "High — critical pharma buyer requirement" },
    { task: "Build Facilities page with photos and specs", effort: "1 week + photography", impact: "High — major trust builder" },
    { task: "Rewrite all homepage copy with proper H1/H2 structure", effort: "1 week", impact: "High — SEO + conversion" },
    { task: "Add structured data (Schema.org) for Organisation and Products", effort: "3 days", impact: "Medium — rich results in search" },
    { task: "Implement keyword strategy with 20–30 target terms", effort: "2–3 weeks ongoing", impact: "High — foundation for all SEO" },
    { task: "Professional product photography session", effort: "1 day shoot + editing", impact: "Very High — transforms perceived quality" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">What Every Competitor Has That Product Armor Lacks</h3>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="text-orange-800 text-sm">
            The following advantages are shared by 3 or more competitors and represent the minimum standard for this market.
            Product Armor must address all of these to be competitive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Structured product pages with categories and individual product detail pages",
            "A clear, working navigation menu with 6+ top-level items",
            "Contact information (phone + email) prominently displayed",
            "An enquiry or quote request form",
            "ISO and quality certification badges on the homepage",
            "A dedicated About Us / Company page with team and story",
            "Physical address and Google Maps embed",
            "Client/customer logos or references",
            "A Facilities / Infrastructure page with photos",
            "A dedicated Quality / Certifications page",
            "Meta titles and descriptions optimised for search",
            "Footer with full site navigation",
            "Social media presence (LinkedIn at minimum)",
            "Properly structured HTML headings (H1/H2/H3)",
            "A Career page (East Pharma, Shriji)",
            "Sustainability / CSR section (Pravesha, Shriji)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg p-3">
              <span className="text-red-500 font-bold mt-0.5 shrink-0">✗</span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Wins (Under 1 Week Each)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Task</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Effort</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Business Impact</th>
                <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Priority</th>
              </tr>
            </thead>
            <tbody>
              {quickWins.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 text-gray-800">{row.task}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{row.effort}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{row.impact}</td>
                  <td className={`p-3 border border-gray-200 text-center font-semibold text-sm ${
                    row.priority === "High" ? "text-red-600" : row.priority === "Medium" ? "text-orange-600" : "text-blue-600"
                  }`}>{row.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">High-Impact Development Improvements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Task</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Estimated Effort</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Business Impact</th>
              </tr>
            </thead>
            <tbody>
              {highImpact.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 text-gray-800">{row.task}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{row.effort}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  const roadmap = [
    {
      phase: "Phase 1 — Emergency Fixes",
      timeline: "Week 1",
      items: [
        { priority: 1, task: "Install Google Analytics 4 + Search Console", effort: "2 hrs", impact: "Critical — visibility into site performance", recommendation: "Do this first. You're flying blind without it." },
        { priority: 2, task: "Add WhatsApp Business sticky button", effort: "2 hrs", impact: "High — immediate lead channel", recommendation: "Free, trivial, high ROI." },
        { priority: 3, task: "Display contact phone + email in header and footer", effort: "1 hr", impact: "High — basic trust", recommendation: "Inexcusable that this is missing." },
        { priority: 4, task: "Write meta titles + descriptions for all pages", effort: "1 day", impact: "Critical — SEO foundation", recommendation: "Without this, you don't exist in search." },
        { priority: 5, task: "Add Privacy Policy + Terms pages", effort: "4 hrs", impact: "Medium — legal compliance", recommendation: "Use a generator, customise, publish." },
        { priority: 6, task: "Add ISO certification badges to homepage", effort: "4 hrs", impact: "High — pharma buyer trust", recommendation: "Scan your certs, display as images with text." },
        { priority: 7, task: "Create and submit XML sitemap", effort: "2 hrs", impact: "High — SEO", recommendation: "Submit to Search Console immediately." },
      ]
    },
    {
      phase: "Phase 2 — Foundation Rebuild",
      timeline: "Weeks 2–6",
      items: [
        { priority: 8, task: "Rebuild homepage hero: replace YouTube with headline + CTA + product image", effort: "1–2 wks", impact: "Very High — #1 conversion fix", recommendation: "This is the single most impactful change." },
        { priority: 9, task: "Build full navigation with 6+ pages", effort: "1 wk", impact: "Critical — site usability", recommendation: "Products, About, Quality, Facilities, Sustainability, Contact." },
        { priority: 10, task: "Build Products section with 3 category pages", effort: "2 wks", impact: "Very High — product discovery + SEO", recommendation: "HDPE Bottles, CR Caps, CT Caps — each needs its own page." },
        { priority: 11, task: "Build quote/enquiry form with auto-response email", effort: "1 wk", impact: "Very High — lead capture", recommendation: "Primary revenue driver." },
        { priority: 12, task: "Build About Us page with team, story, facility photos", effort: "1 wk + photos", impact: "High — brand building", recommendation: "Get professional photos taken — invest the money." },
        { priority: 13, task: "Build Quality & Certifications page", effort: "3 days", impact: "High — pharma buyer requirement", recommendation: "List every cert with scan/logo and expiry year." },
        { priority: 14, task: "Rewrite all body copy with proper H1/H2/H3 structure", effort: "1 wk", impact: "High — SEO + readability", recommendation: "Hire a B2B copywriter if in-house writing is not strong." },
        { priority: 15, task: "Professional product photography", effort: "1 day shoot", impact: "Very High — perceived quality", recommendation: "Budget ₹30,000–50,000 for this. Non-negotiable." },
      ]
    },
    {
      phase: "Phase 3 — Growth & Differentiation",
      timeline: "Weeks 7–16",
      items: [
        { priority: 16, task: "Launch blog with 5 seed articles", effort: "3–4 wks", impact: "High — organic traffic long-term", recommendation: "Focus on regulatory compliance, sustainability, HDPE technical topics." },
        { priority: 17, task: "Add client logos section to homepage", effort: "2 days", impact: "High — social proof", recommendation: "Contact top 8–10 clients for permission to display logo." },
        { priority: 18, task: "Build Facilities page with photos + specs", effort: "1 wk + photos", impact: "High — trust + differentiation", recommendation: "Buyers want to see cleanroom, machines, QC lab." },
        { priority: 19, task: "Implement keyword strategy (20–30 terms)", effort: "Ongoing", impact: "High — SEO compound growth", recommendation: "Map to specific pages. Track monthly with Search Console." },
        { priority: 20, task: "Add structured data (Schema.org)", effort: "3 days", impact: "Medium — rich results", recommendation: "Organisation + Product + BreadcrumbList schemas." },
        { priority: 21, task: "Create downloadable product catalogue PDF (email-gated)", effort: "1 wk", impact: "High — lead magnet", recommendation: "This is your best B2B lead magnet. Invest in design." },
        { priority: 22, task: "Add 3–5 customer testimonials", effort: "1 wk (to collect)", impact: "High — social proof", recommendation: "Email your best 10 clients this week. Most will respond." },
        { priority: 23, task: "Build Regulatory Compliance page", effort: "1 wk", impact: "High — differentiator vs. most competitors", recommendation: "Cover WHO-GMP, USDMF, EU GMP. Only Pravesha does this well." },
      ]
    },
    {
      phase: "Phase 4 — Optimisation",
      timeline: "Months 5–6",
      items: [
        { priority: 24, task: "Run conversion rate optimisation (A/B test CTAs and headlines)", effort: "Ongoing", impact: "Medium — incremental lift", recommendation: "Only after phases 1–3 are done." },
        { priority: 25, task: "Add case studies (1–2 detailed)", effort: "2 wks each", impact: "High — differentiating at this stage", recommendation: "Aim for quantified outcomes: rejection rate, cost savings, delivery time." },
        { priority: 26, task: "Explore holography / anti-counterfeiting partnership", effort: "2–3 months", impact: "High — premium differentiator", recommendation: "Pravesha does this uniquely. Gap to close." },
        { priority: 27, task: "Launch LinkedIn company page with regular posting", effort: "Ongoing (2 posts/wk)", impact: "Medium — B2B brand building", recommendation: "Pharma procurement teams are active on LinkedIn." },
        { priority: 28, task: "Implement live chat (Crisp or Tidio — free tier)", effort: "2 hrs", impact: "Medium — real-time conversion", recommendation: "Monitor response rate. If team can't respond, disable." },
      ]
    }
  ];

  const phaseColors = ["bg-red-50 border-red-200", "bg-orange-50 border-orange-200", "bg-blue-50 border-blue-200", "bg-green-50 border-green-200"];
  const phaseHeaderColors = ["text-red-800", "text-orange-800", "text-blue-800", "text-green-800"];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          <strong>Estimated time to reach competitive parity:</strong> 4–5 months of focused effort. The site needs a
          ground-up rebuild — not a refresh. Think of this as building a new website while keeping the domain. Phases
          1 and 2 are non-negotiable and should begin immediately. Phases 3 and 4 build on that foundation.
        </p>
      </div>
      {roadmap.map((phase, pi) => (
        <div key={pi} className={`border rounded-xl p-5 ${phaseColors[pi]}`}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className={`text-base font-bold ${phaseHeaderColors[pi]}`}>{phase.phase}</h3>
            <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 font-medium">{phase.timeline}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-white bg-opacity-70">
                  <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 w-8">#</th>
                  <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[200px]">Task</th>
                  <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[100px]">Effort</th>
                  <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[180px]">Business Impact</th>
                  <th className="text-left p-2.5 font-semibold text-gray-700 border border-gray-200 min-w-[200px]">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {phase.items.map((item, ii) => (
                  <tr key={ii} className="bg-white bg-opacity-60">
                    <td className="p-2.5 border border-gray-200 font-bold text-gray-500">{item.priority}</td>
                    <td className="p-2.5 border border-gray-200 font-medium text-gray-800">{item.task}</td>
                    <td className="p-2.5 border border-gray-200 text-gray-600">{item.effort}</td>
                    <td className="p-2.5 border border-gray-200 text-gray-700">{item.impact}</td>
                    <td className="p-2.5 border border-gray-200 text-gray-700">{item.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionContent({ section }: { section: string }) {
  switch (section) {
    case "Overview": return <OverviewSection />;
    case "Positioning": return <PositioningSection />;
    case "Homepage": return <HomepageSection />;
    case "Features": return <FeaturesSection />;
    case "UX": return <UXSection />;
    case "Design": return <DesignSection />;
    case "SEO": return <SEOSection />;
    case "Content": return <ContentSection />;
    case "Trust": return <TrustSection />;
    case "Lead Gen": return <LeadGenSection />;
    case "Technical": return <TechnicalSection />;
    case "Competitor Gaps": return <CompetitorGapsSection />;
    case "Roadmap": return <RoadmapSection />;
    default: return null;
  }
}

export default function App() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Website Audit Report</h1>
              <p className="text-xs text-gray-500 leading-tight">productarmor.com vs 5 competitors · June 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{SCORES.overall}/100</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
            <a
              href="https://www.productarmor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline hidden sm:block"
            >
              productarmor.com ↗
            </a>
          </div>
        </div>
        <div className="border-t border-gray-100 overflow-x-auto">
          <div className="max-w-screen-2xl mx-auto px-4 flex gap-0.5 py-1">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  active === s
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">{active}</h2>
          {active === "Overview" && (
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive audit of productarmor.com against 5 competitors in the pharmaceutical packaging space.
            </p>
          )}
        </div>
        <SectionContent section={active} />
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Website Audit Report · productarmor.com · Audited June 2026 · Competitors: Pravesha, East Pharma, Mold-Tek, Shriji Polymers, Triveni Polychem
      </footer>
    </div>
  );
}
