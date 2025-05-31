import { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";

export default function Landing() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "NASDAQ" },
        { proName: "BSE:SENSEX", title: "SENSEX" },
        { proName: "NSE:NIFTY", title: "NIFTY 50" },
        { proName: "FOREXCOM:DJI", title: "Dow Jones" },
      ],
      colorTheme: "light",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });
    const container = document.getElementById("ticker-tape-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <>
      <PublicNavbar />

      {/* 🔔 TradingView Ticker Banner */}
      <div id="ticker-tape-container" className="w-full" />

      {/* 🚀 Hero Dashboard */}
      <section className="bg-blue-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Smart<span className="text-blue-600">Stox</span>Vest
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8">
          Welcome to <strong>SmartStoxVest</strong>, your <em>AI-powered dashboard</em> for short-, medium-, and long-term stock investment analysis.
          Pick a strategy and let insights flow like the river of profits. 🚀
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
          <Link to="/app/short-term" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-base shadow transition text-center">
            📈 Short-Term Analysis
          </Link>
          <Link to="/app/medium-term" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl text-base shadow transition text-center">
            🧠 Medium-Term Forecast
          </Link>
          <Link to="/app/long-term" className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl text-base shadow transition text-center">
            📉 Long-Term Risk
          </Link>
        </div>
      </section>

      {/* 🎯 Mission */}
      <section id="mission" className="py-16 bg-[#f4f7fb] text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg">
          At SmartStoxVest, our mission is to democratize smart investing by equipping every individual with AI-powered tools to make data-driven financial decisions.
          We believe the future of finance should be transparent, intelligent, and accessible to everyone.
        </p>
      </section>

      {/* 👥 Team */}
      <section id="team" className="py-16 bg-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">About the Team</h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg">
          What started as a university project quickly became a passion. As an aspiring investment banker studying economics,
          I built this app to bridge the gap between theory and real-world investing. Alongside a small team of curious minds,
          we’re creating tools that make complex strategies feel effortless, empowering users to take charge of their financial journey.
        </p>
      </section>

      {/* ⚙️ Features */}
      <section id="features" className="py-16 bg-[#f4f7fb]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-10">What You Can Do with SmartStoxVest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard title="📈 Short-Term Analysis" desc="Get daily technical insights and trend predictions for immediate decisions." />
            <FeatureCard title="🧠 Medium-Term AI" desc="Leverage our LSTM-powered engine to forecast future movements 1–3 months ahead." />
            <FeatureCard title="📉 Long-Term Risk" desc="Simulate thousands of market scenarios with our Monte Carlo engine for better planning." />
            <FeatureCard title="🤖 AI Recommendations" desc="Get smart buy/sell suggestions based on RSI, volatility, and news sentiment." />
          </div>
        </div>
      </section>

      {/* 💬 Feedback */}
      <section id="feedback" className="py-16 bg-white px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">We’d Love Your Feedback 💭</h2>
          <p className="mb-6 text-gray-600">
            Your thoughts help us make SmartStoxVest smarter. Tell us what’s great or what we can improve!
          </p>
          <form
            action="https://formsubmit.co/smartstoxvest@gmail.com"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="_next" value="https://smartstoxvest.com/thank-you" />
            <input type="hidden" name="_subject" value="New Feedback from SmartStoxVest" />
            <input type="hidden" name="_captcha" value="false" />

            <input
              type="text"
              name="name"
              placeholder="Your name (optional)"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email (optional)"
              className="w-full border rounded px-4 py-2"
            />
            <textarea
              name="feedback"
              required
              placeholder="Share your feedback..."
              rows={4}
              className="w-full border rounded px-4 py-2"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            >
              Send Feedback
            </button>
          </form>
        </div>
      </section>

      {/* ❓ FAQ */}
      <section id="FAQ" className="bg-[#fdf7e3] py-12 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full">📢 New!</span>
            <p className="text-sm mt-2">We’ve just rolled out our updated strategy engine — faster, smarter, and more accurate.</p>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
          <details><summary>▶ Is SmartStoxVest really free?</summary><p className="text-sm text-gray-600 py-1">Yes, our core features are free for everyone.</p></details>
          <details><summary>▶ What markets does SmartStoxVest support?</summary><p className="text-sm text-gray-600 py-1">US, UK, and Indian stocks currently. More coming soon!</p></details>
          <details><summary>▶ Is my financial data safe?</summary><p className="text-sm text-gray-600 py-1">We do not store or share any personal investment data.</p></details>
          <details><summary>▶ How often are predictions updated?</summary><p className="text-sm text-gray-600 py-1">Daily, with continuous model training in the backend.</p></details>
          <details><summary>▶ Can I suggest a feature or report a bug?</summary><p className="text-sm text-gray-600 py-1">Yes! Use the feedback form above or email us.</p></details>
        </div>
      </section>

      {/* 🔗 Footer + Share */}
      <footer className="bg-[#002d62] text-white py-10 text-center px-4">
        <p className="text-sm mb-2">
          📣 <strong>Share SmartStoxVest</strong> with your network
        </p>
        <div className="flex justify-center gap-4 text-2xl mb-4">
          <a href="https://linkedin.com" target="_blank">🔗</a>
          <a href="https://x.com" target="_blank">𝕏</a>
          <a href="https://facebook.com" target="_blank">📘</a>
          <a href="https://whatsapp.com" target="_blank">🟢</a>
        </div>
        <p className="text-xs leading-5">
          © {new Date().getFullYear()} SmartStoxVest. Made with ❤️ for investors. | <a href="/privacy" className="underline">Privacy Policy</a><br />
          Have questions? Email us at <a href="mailto:smartstoxvest@gmail.com" className="underline">smartstoxvest@gmail.com</a>
        </p>
      </footer>
    </>
  );
}

// 🔹 Feature Card Component
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl text-left shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
