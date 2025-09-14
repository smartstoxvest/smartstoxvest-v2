import React from "react";

const withUtm = (base: string, source: string) =>
  `${base}?utm_source=smartstoxvest&utm_medium=site&utm_campaign=sa_affiliate&utm_content=${encodeURIComponent(source)}`;

// ✅ Use Vite base so public assets resolve under any subpath
const PUBLIC_BASE = import.meta.env.BASE_URL || "/";

export default function Partnership() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#0f1623] text-[#FFF5E8]">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-extrabold">SmartStoxVest × Seeking Alpha</h1>
          <p className="mt-3 max-w-2xl leading-7 opacity-95">
            We’ve partnered to complement SmartStoxVest with unbiased research, quant-powered ratings,
            and curated stock ideas—tools that help investors validate decisions confidently.
          </p>
          <a
            href={withUtm("https://link.seekingalpha.com/49SKCM6/4G6SHH/", "partnership_hero_premium")}
            target="_blank" rel="noopener noreferrer"
            className="inline-block mt-5 bg-[#FF7200] hover:bg-[#FEC20F] text-white font-semibold px-5 py-3 rounded-xl"
          >
            Explore Seeking Alpha Premium →
          </a>
        </div>
      </section>

      {/* Value pillars */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard title="Unbiased Research" desc="Independent contributor analysis to help you validate ideas." />
            <ValueCard title="Quant Ratings" desc="Data-driven stock scores and screeners for disciplined decisions." />
            <ValueCard title="Curated Ideas" desc="Time-saving stock selections focused on long-term growth." />
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[#414A5F] mb-6">Explore the Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              title="Seeking Alpha Premium"
              desc="Research depth, quant ratings, and market transparency tools."
              href={withUtm("https://link.seekingalpha.com/49SKCM6/4G6SHH/", "card_premium")}
              cta="Learn More"
            />
            <ProductCard
              title="Alpha Picks"
              desc="Curated, data-backed ideas that cut through noise."
              href={withUtm("https://link.seekingalpha.com/49SKCM6/4HKP84/", "card_alpha_picks")}
              cta="Explore Alpha Picks"
              outline
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ProductCard
              title="Premium + Picks Bundle"
              desc="Combine research depth with curated selections."
              href={withUtm("https://link.seekingalpha.com/49SKCM6/4JZKZP/", "card_bundle")}
              cta="View Bundle"
              soft
            />
            <ProductCard
              title="Seeking Alpha PRO"
              desc="Institutional-grade insights and exclusive research for professionals."
              href={withUtm("https://link.seekingalpha.com/49SKCM6/4JZKZP/", "card_bundle")}
              cta="Learn About PRO"
              outline
            />
          </div>

          {/* Disclosures */}
          <div className="text-xs leading-relaxed space-y-2 mt-8 text-[#414A5F]">
            <p><strong>Sponsorship Disclosure:</strong> This page includes promotions for Seeking Alpha. I may receive compensation, such as affiliate commissions, if you sign up or purchase through the links provided.</p>
            <p><strong>Financial Disclaimer:</strong> This content is for educational and entertainment purposes only. It does not constitute financial advice and does not represent the views of Seeking Alpha.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-[#FFF5E8] border border-[#FEC20F] p-6">
      <h3 className="text-lg font-semibold text-[#414A5F]">{title}</h3>
      <p className="text-[#414A5F] mt-2">{desc}</p>
    </div>
  );
}

function ProductCard({
  title, desc, href, cta, outline, soft,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  outline?: boolean;
  soft?: boolean;
}) {
  const base = "rounded-2xl p-6 shadow-sm hover:shadow-md transition border";
  const tone = outline
    ? "bg-white text-[#414A5F] border-[#FF7200]"
    : soft
    ? "bg-[#FFF5E8] text-[#414A5F] border-[#FFF5E8]"
    : "bg-white text-[#414A5F] border-[#E6E6E6]";
  return (
    <div className={`${base} ${tone}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2">{desc}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 px-5 py-3 rounded-xl font-semibold bg-[#FF7200] hover:bg-[#FEC20F] text-white"
      >
        {cta} →
      </a>
      <p className="mt-3 text-xs opacity-80">
        This is an affiliate link. I may receive compensation if you sign up or purchase through this link.
      </p>
    </div>
  );
}

