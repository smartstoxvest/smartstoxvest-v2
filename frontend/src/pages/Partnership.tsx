import React from "react";
import { motion } from "framer-motion";

const withUtm = (base: string, source: string) =>
  `${base}?utm_source=smartstoxvest&utm_medium=site&utm_campaign=sa_affiliate&utm_content=${encodeURIComponent(
    source
  )}`;

const PUBLIC_BASE = import.meta.env.BASE_URL || "/";

/* ---------- Motion presets ---------- */
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
      {/* =====================  Professional top hero  ===================== */}
      <section className="relative overflow-hidden bg-[#0f1623] text-[#FFF5E8]">
        {/* soft gradient halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(80rem 40rem at 50% -20%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(40rem 20rem at 90% 0%, rgba(255,165,0,0.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-6 md:pt-10 md:pb-8">
          {/* Logos + badge centered row */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* SmartStoxVest brand */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-3">
              <img
                src={`${PUBLIC_BASE}logo.png`}
                alt="SmartStoxVest"
                className="h-10 w-10 rounded-xl ring-1 ring-white/15 bg-white/5 p-1 object-contain"
              />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight">
                Smart<span className="text-[#60a5fa]">Stox</span>Vest
              </span>
            </motion.div>

            {/* Divider + New Partnership pill */}
            <motion.div {...fadeUp(0.05)} className="flex items-center gap-3">
              <span className="text-slate-400">×</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 px-3 py-1 text-[13px] font-semibold text-amber-900 ring-1 ring-amber-300/70 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                New Partnership
              </span>
            </motion.div>

            {/* Seeking Alpha brand */}
            <motion.div {...fadeUp(0.1)} className="flex items-center gap-3">
              <img
                src={`${PUBLIC_BASE}Seeking_Alpha.png`}
                alt="Seeking Alpha"
                className="h-10 w-10 rounded-xl ring-1 ring-white/15 bg-white p-1 object-contain"
              />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight">
                <span className="text-[#ff6a00]">Seeking</span> Alpha
              </span>
            </motion.div>
          </div>

          {/* Headline + copy + CTA */}
          <motion.h1
            {...fadeUp(0.12)}
            className="mt-6 text-center text-3xl md:text-4xl font-extrabold"
          >
            SmartStoxVest <span className="text-slate-400">×</span>{" "}
            <span className="text-[#ff6a00]">Seeking Alpha</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.18)}
            className="mt-3 text-center max-w-3xl mx-auto leading-7 opacity-95 text-[#FDEBD1]"
          >
            We’ve partnered to complement SmartStoxVest with unbiased research,
            quant-powered ratings, and curated stock ideas—tools that help
            investors validate decisions confidently.
          </motion.p>

          <div className="flex items-center justify-center">
            <motion.a
              {...fadeUp(0.24)}
              href={withUtm(
                "https://link.seekingalpha.com/49SKCM6/4G6SHH/",
                "partnership_hero_premium"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-[#FF7200] hover:bg-[#FEC20F] text-white font-semibold px-5 py-3 rounded-xl shadow-sm"
            >
              Explore Seeking Alpha Premium →
            </motion.a>
          </div>
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

/* ---------- Cards ---------- */
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

/* ========== Tiny CSS animation for the older gradient (optional) ==========
   If you kept the animated sheen section from a previous version, add this:

@keyframes pan {
  0%   { transform: translateX(-25%) skewX(-12deg); }
  50%  { transform: translateX(0%)    skewX(-12deg); }
  100% { transform: translateX(-25%)  skewX(-12deg); }
}
*/
