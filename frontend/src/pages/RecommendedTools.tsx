import TopNavigation from "@/components/TopNavigation";

const featuredTool = {
  title: "🌟 Featured Tool of the Month: TradingView",
  description:
    "This month, we’re spotlighting TradingView for its powerful, flexible charting and real-time analysis. Whether you're backtesting or watching breakout patterns, it’s a must-have.",
  link: "https://www.tradingview.com/?aff_id=152339",
  cta: "🚀 Try TradingView Now",
};

const tools = [
  {
    title: "📈 TradingView – Pro-Level Charts",
    description:
      "TradingView is our go-to platform for charting, technical analysis, and backtesting. It's powerful, sleek, and essential for serious investors.",
    link: "https://www.tradingview.com/?aff_id=152339",
    cta: "Try TradingView – Get $15 Off",
  },
  {
    title: "📊 Seeking Alpha – Fundamental Deep Dives",
    description:
      "Want earnings transcripts, analyst breakdowns, and top-tier insights? Seeking Alpha Premium is perfect for leveling up your decision-making.",
    link: "https://seekingalpha.com/?utm_source=affiliate&utm_medium=152339",
    cta: "Explore Seeking Alpha Premium",
  },
  {
    title: "📚 Must-Read Investment Books",
    description:
      "These classics are essential reading. Whether you’re a newbie or a pro, these books are timeless investments in your financial knowledge.",
    link: "https://www.amazon.com/dp/0060555661?tag=smartstoxvest-21",
    cta: "Browse Our Book List on Amazon",
  },
  {
    title: "📣 Benzinga Pro – Real-Time News Terminal",
    description:
      "Stay ahead of the herd with ultra-fast, pro-grade financial news. A serious tool for traders who want the edge.",
    link: "https://www.benzinga.com/pro?utm_campaign=affiliate&utm_medium=152339",
    cta: "Check Out Benzinga Pro",
  },
];

const RecommendedTools = () => {
  return (
    <>
      <TopNavigation />

      <div className="p-6 max-w-5xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-4">🛠️ Recommended Tools for Smarter Investing</h1>
        <p className="mb-8 text-gray-600">
          These are hand-picked platforms and resources we either use ourselves or trust deeply.
          Each one complements the SmartStoxVest experience.
        </p>

        {/* 🌟 Featured Tool of the Month */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 mb-10 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">{featuredTool.title}</h2>
          <p className="text-yellow-700">{featuredTool.description}</p>
          <a
            href={featuredTool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block px-5 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
          >
            {featuredTool.cta}
          </a>
        </div>

        {/* 🧰 Tool List */}
        {tools.map((tool, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{tool.title}</h2>
            <p className="mb-4">{tool.description}</p>
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {tool.cta}
            </a>
          </div>
        ))}

        <div className="text-sm text-gray-500 mt-8">
          <p>
            ⚠️ Disclaimer: Some of the links above are affiliate links. If you click and buy, we may earn a commission — at no additional cost to you. We only recommend what we truly trust.
          </p>
        </div>
      </div>
    </>
  );
};

export default RecommendedTools;
