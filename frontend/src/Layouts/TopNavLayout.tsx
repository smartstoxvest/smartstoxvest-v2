import { useEffect } from "react";
import TopNavigation from "@/components/TopNavigation";

const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
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
      container.innerHTML = ""; // prevent duplicate tickers
      container.appendChild(script);
    }
  }, []);

  return (
    <>
      <TopNavigation />

      {/* ✅ Nicely styled ticker banner */}
      <div
        id="ticker-tape-container"
        className="border-b border-gray-200 bg-white py-2 px-4"
      />

      <main className="px-4 py-6 max-w-5xl mx-auto">{children}</main>
    </>
  );
};

export default TopNavLayout;
