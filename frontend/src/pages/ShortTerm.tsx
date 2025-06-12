// ✅ Updated frontend ShortTerm.tsx to match new backend logic and confidence-aware UI
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import StockChart from "@/components/StockChart";
import TopNavigation from "@/components/TopNavigation";

const API_URL = import.meta.env.VITE_API_URL;

interface ShortTermResult {
  symbol: string;
  error?: string;
  current_price?: number;
  predicted_price?: number;
  rsi?: number;
  volatility?: number;
  stop_loss?: number;
  take_profit?: number;
  decision?: string;
  final_decision?: string;
  news_sentiment?: string;
  sentiment_score?: number;
  volume_spike?: string;
  trend?: string;
  confidence?: string;
  last_updated?: string;
}

interface ChartData {
  dates: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  sma50: number[];
  sma200: number[];
  rsi: number[];
}

const getBadgeClass = (finalDecision: string) => {
  if (finalDecision.includes("Strongly")) return "bg-green-600 text-white";
  if (finalDecision.includes("Invest")) return "bg-green-400 text-white";
  if (finalDecision.includes("Review") || finalDecision.includes("Hold")) return "bg-yellow-400 text-black";
  if (finalDecision.includes("Avoid")) return "bg-red-500 text-white";
  return "bg-gray-400 text-white";
};

const ShortTerm = () => {
  const [symbols, setSymbols] = useState("");
  const [results, setResults] = useState<ShortTermResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetType, setAssetType] = useState("Stock");
  const [exchange, setExchange] = useState("NASDAQ");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedChart, setSelectedChart] = useState<"candlestick" | "sma" | "rsi">("candlestick");

  useEffect(() => {
    if (!selectedSymbol) return;
    const timeoutId = setTimeout(() => {
      axios.get(`${API_URL}/api/short-term-chart-data/${selectedSymbol}`, {
        params: { exchange },
      })
        .then(res => setChartData(res.data))
        .catch(err => {
          console.error("Chart data error", err);
          setChartData(null);
        });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedSymbol, exchange]);

  const currencySymbol = (exchange: string) => {
    switch (exchange) {
      case "LSE": return "£";
      case "NSE": case "BSE": return "₹";
      case "HKEX": return "HK$";
      default: return "$";
    }
  };

  const fetchShortTerm = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/short-term-predict`, {
        symbols,
        exchange,
        asset_type: assetType,
        risk_tolerance: 1.0,
      });
      setResults(response.data);
    } catch (error) {
      console.error("Short-term analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Symbol,Current Price,Predicted Price,RSI,Volatility,Stop Loss,Take Profit,Decision,News Sentiment,Final Decision,Trend,Volume Spike,Sentiment Score,Confidence",
    ];
    const rows = results.map((r) =>
      `${r.symbol},${r.current_price},${r.predicted_price},${r.rsi},${r.volatility},${r.stop_loss},${r.take_profit},${r.decision},${r.news_sentiment},${r.final_decision},${r.trend},${r.volume_spike},${r.sentiment_score},${r.confidence},${r.last_updated}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "short_term_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6">
      <TopNavigation />
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 flex items-center gap-2">
        🚀 Short-Term Stock Analysis
      </h1>

      {/* Form */}
      <div className="max-w-2xl mx-auto space-y-6 mb-10">
        <div>
          <label className="block text-sm font-semibold mb-1">Select Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full border rounded-md p-3"
          >
            {["Stock", "ETF", "Crypto", "Forex"].map(type => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Select Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full border rounded-md p-3"
          >
            {["NASDAQ", "NYSE", "LSE", "NSE", "BSE", "HKEX", "Crypto"].map(ex => (
              <option key={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Enter Stock Symbols</label>
          <input
            type="text"
            placeholder="e.g. TSLA, AAPL"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            className="w-full border rounded-md p-3"
          />
        </div>

        <Button onClick={fetchShortTerm} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg">
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {results.length > 0 && (
        <>
          <Button onClick={downloadCSV} className="mb-4 bg-green-600 text-white hover:bg-green-700 px-4 py-2">
            ⬇️ Download CSV
          </Button>

          <div className="space-y-4">
            {results.map((res) => {
              if ("error" in res) {
                return (
                  <div key={res.symbol} className="border rounded-md p-4 bg-red-100">
                    <strong>{res.symbol}</strong>: ⚠️ {res.error}
                  </div>
                );
              }

              return (
                <div key={res.symbol} className="border rounded-lg p-4 shadow bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold">{res.symbol}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeClass(res.final_decision || "")}`}>
                      {res.final_decision}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div><strong>Price:</strong> {currencySymbol(exchange)}{res.current_price}</div>
                    <div><strong>Predicted:</strong> {currencySymbol(exchange)}{res.predicted_price}</div>
                    <div><strong>RSI:</strong> {res.rsi}</div>
                    <div><strong>Volatility:</strong> {res.volatility}</div>
                    <div><strong>SL/TP:</strong> {currencySymbol(exchange)}{res.stop_loss} / {currencySymbol(exchange)}{res.take_profit}</div>
                    <div><strong>Decision:</strong> {res.decision}</div>
                    <div><strong>News:</strong> {res.news_sentiment}</div>
                    <div><strong>Trend:</strong> {res.trend}</div>
                    <div><strong>Volume Spike:</strong> {res.volume_spike}</div>
                    <div><strong>Sentiment Score:</strong> {res.sentiment_score}</div>
                    <div><strong>Confidence:</strong> {res.confidence}</div>
                  </div>

                  <div className="mt-2 text-sm font-semibold">
                    <strong>Smart Verdict:</strong>{" "}
                    {res.confidence === "🔴 Low"
                      ? "❌ Avoid for Now"
                      : res.final_decision?.includes("Invest")
                        ? "✅ Invest Now"
                        : "👀 Monitor Closely"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">📊 View Detailed Charts</h2>
            <select
              className="border p-2 rounded-md"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
            >
              <option value="">-- Select Symbol --</option>
              {results.map(r => <option key={r.symbol} value={r.symbol}>{r.symbol}</option>)}
            </select>

            {chartData && (
              <>
                <div className="mt-4">
                  <label className="font-medium mr-3">Chart Type:</label>
                  <select
                    className="border p-2 rounded-md"
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value as any)}
                  >
                    <option value="candlestick">Candlestick</option>
                    <option value="sma">Moving Averages (SMA)</option>
                    <option value="rsi">Relative Strength Index (RSI)</option>
                  </select>
                </div>
                <div className="mt-6">
                  <StockChart data={chartData} type={selectedChart} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShortTerm;
