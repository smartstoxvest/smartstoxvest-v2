import React from "react";
import { motion } from "framer-motion";

const withUtm = (base: string, source: string) =>
  `${base}?utm_source=smartstoxvest&utm_medium=site&utm_campaign=sa_affiliate&utm_content=${encodeURIComponent(
    source
  )}`;

const PUBLIC_BASE = import.meta.env.BASE_URL || "/";

// Motion presets
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const liftOnHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export default function Partnership() {
  return (
    <main className="min-h-screen bg-white">
      {/* =====================  Top bar with logos (animated gradient)  ===================== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#414A5F" }}
      >
        {/* Animated gradient sheen */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-[200%] h-full -skew-x-12 animate-[pan_10s_linear_infinite] bg-[radial-gradient(60%_120%_at_0%_0%,#FFF5E8_0%,transparent_50%),radial-gradient(60%_120%_at_100%_100%,#FEC20F_0%,transparent_50%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
		
          <motion.img
            {...fadeUp(0)}
            src={`${PUBLIC_BASE}logo.png`}
            alt="SmartStoxVest"
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-3">
            <motion.span
              {...fadeUp(0.05)}
              className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-[#FFF5E8] text-[#414A5F] font-semibold flex items-center gap-1"
            >
              <span className="inline-block h-2 w-2 bg-[#FF7200] rounded-full animate-pulse" />
              New Partnership
            </motion.span>
            <motion.img
              {...fadeUp(0.1)}
              src={`${PUBLIC_BASE}Seeking_Alpha.png`}
              alt="Seeking Alpha"
              className="h-6 w-auto opacity-90"
            />
          </div>
        </div>
      </section>

      {/* =====================  Hero  ===================== */}
      <section className="bg-[#0f1623] text-[#FFF5E8]">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <motion.h1
            {...fadeUp(0)}
            className="text-3xl md:text-4xl font-extrabold"
          >
            SmartStoxVest × Seeking Alpha
          </motion.h1>
          <motion.p
            {...fadeUp(0.08)}
            className="mt-3 max-w-2xl leading-7 opacity-95"
          >
            We’ve partnered to complement SmartStoxVest with unbiased research,
            quant-powered ratings, and curated stock ideas—tools that help
            investors validate decisions confidently.
          </motion.p>

          <motion.a
            {...fadeUp(0.16)}
            href={withUtm(
              "https://link.seekingalpha.com/49SKCM6/4G6SHH/",
              "partnership_hero_premium"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-[#FF7200] hover:bg-[#FEC20F] text-white font-semibold px-5 py-3 rounded-xl"
          >
            Explore Seeking Alpha Premium →
          </motion.a>
        </div>
      </section>

      {/* =====================  Value pillars  ===================== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              title="Unbiased Research"
              desc="Independent contributor analysis to help you validate ideas."
              delay={0}
            />
            <ValueCard
              title="Quant Ratings"
              desc="Data-driven stock scores and screeners for disciplined decisions."
              delay={0.05}
            />
            <ValueCard
              title="Curated Ideas"
              desc="Time-saving stock selections focused on long-term growth."
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* =====================  Product grid  ===================== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pb-14">
          <motion.h2
            {...fadeUp(0)}
            className="text-2xl md:text-3xl font-bold text-[#414A5F] mb-6"
          >
            Explore the Tools
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              title="Seeking Alpha Premium"
              desc="Research depth, quant ratings, and market transparency tools."
              href={withUtm(
                "https://link.seekingalpha.com/49SKCM6/4G6SHH/",
                "card_premium"
              )}
              cta="Learn More"
              delay={0.02}
            />
            <ProductCard
              title="Alpha Picks"
              desc="Curated, data-backed ideas that cut through noise."
              href={withUtm(
                "https://link.seekingalpha.com/49SKCM6/4HKP84/",
                "card_alpha_picks"
              )}
              cta="Explore Alpha Picks"
              outline
              delay={0.06}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ProductCard
              title="Premium + Picks Bundle"
              desc="Combine research depth with curated selections."
              href={withUtm(
                "https://link.seekingalpha.com/49SKCM6/4JZKZP/",
                "card_bundle"
              )}
              cta="View Bundle"
              soft
              delay={0.02}
            />
            <ProductCard
              title="Seeking Alpha PRO"
              desc="Institutional-grade insights and exclusive research for professionals."
              href={withUtm(
                "https://link.seekingalpha.com/49SKCM6/4MQCFX/",
                "card_pro"
              )}
              cta="Learn About PRO"
              outline
              delay={0.06}
            />
          </div>

          {/* Disclosures */}
          <motion.div
            {...fadeUp(0.1)}
            className="text-xs leading-relaxed space-y-2 mt-8 text-[#414A5F]"
          >
            <p>
              <strong>Sponsorship Disclosure:</strong> This page includes promotions for
              Seeking Alpha. I may receive compensation, such as affiliate commissions,
              if you sign up or purchase through the links provided.
            </p>
            <p>
              <strong>Financial Disclaimer:</strong> This content is for educational and
              entertainment purposes only. It does not constitute financial advice and
              does not represent the views of Seeking Alpha.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
  title,
  desc,
  delay = 0,
}: {
  title: string;
  desc: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      {...liftOnHover}
      className="rounded-2xl bg-[#FFF5E8] border border-[#FEC20F] p-6"
    >
      <h3 className="text-lg font-semibold text-[#414A5F]">{title}</h3>
      <p className="text-[#414A5F] mt-2">{desc}</p>
    </motion.div>
  );
}

function ProductCard({
  title,
  desc,
  href,
  cta,
  outline,
  soft,
  delay = 0,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  outline?: boolean;
  soft?: boolean;
  delay?: number;
}) {
  const base = "rounded-2xl p-6 shadow-sm transition border";
  const tone = outline
    ? "bg-white text-[#414A5F] border-[#FF7200]"
    : soft
    ? "bg-[#FFF5E8] text-[#414A5F] border-[#FFF5E8]"
    : "bg-white text-[#414A5F] border-[#E6E6E6]";
  return (
    <motion.div {...fadeUp(delay)} {...liftOnHover} className={`${base} ${tone}`}>
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
    </motion.div>
  );
}

/* ========== Tiny CSS animation for the gradient ========== */
/* Add this once in your global CSS (e.g., index.css or App.css):

@keyframes pan {
  0%   { transform: translateX(-25%) skewX(-12deg); }
  50%  { transform: translateX(0%)    skewX(-12deg); }
  100% { transform: translateX(-25%)  skewX(-12deg); }
}

*/
