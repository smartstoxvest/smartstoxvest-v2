// src/pages/ShortTerm.tsx

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

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
  news_sentiment?: string;
  final_decision?: string;
}

const ShortTerm = () => {
  const [symbols, setSymbols] = useState("AAPL,TSLA");
  const [results, setResults] = useState<ShortTermResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetType, setAssetType] = useState("Stock");
  const [exchange, setExchange] = useState("NASDAQ");

  const currencySymbol = (exchange: string) => {
    switch (exchange) {
      case "LSE":
        return "£"; // British Pound
      case "NSE":
      case "BSE":
        return "₹"; // Indian Rupee
      case "HKEX":
        return "HK$"; // Hong Kong Dollar
      default:
        return "$"; // Default US Dollar
    }
  };

  const getFinalDecision = (decision?: string, news_sentiment?: string) => {
    if (decision === "Invest") {
      if (news_sentiment?.includes("Positive")) {
        return "🚀 Invest Strongly"; // ✅ Positive News + Invest = Invest Strongly
      } else if (news_sentiment?.includes("Neutral")) {
        return "✅ Invest"; // ✅ Neutral News + Invest = Invest
      } else {
        return "✅ Invest"; // ✅ Even if no news, still Invest
      }
    } else if (decision === "Hold") {
      if (news_sentiment?.includes("Positive")) {
        return "🤔 Hold Carefully"; // Positive news but model says Hold
      } else {
        return "🤔 Hold"; // Just Hold
      }
    }
    return "❌ Avoid"; // Default: Avoid
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

      const enrichedResults = response.data.map((res: ShortTermResult) => ({
        symbol: res.symbol,
        current_price: res.current_price,
        predicted_price: res.predicted_price,
        rsi: res.rsi,
        volatility: res.volatility,
        stop_loss: res.stop_loss,
        take_profit: res.take_profit,
        decision: res.decision,
        news_sentiment: res.news_sentiment,
        final_decision: getFinalDecision(res.decision, res.news_sentiment), // 👈 live recompute
      }));

      setResults(enrichedResults);
    } catch (error) {
      console.error("Short-term analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };


  const downloadCSV = () => {
    const headers = [
      "Symbol,Current Price,Predicted Price,RSI,Volatility,Stop Loss,Take Profit,Decision,News Sentiment,Final Decision",
    ];
    const rows = results.map((r) =>
      `${r.symbol},${r.current_price},${r.predicted_price},${r.rsi},${r.volatility},${r.stop_loss},${r.take_profit},${r.decision},${r.news_sentiment},${r.final_decision}`
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
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        🚀 Short-Term Stock Analysis
      </h1>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto space-y-6 mb-10">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full border rounded-md p-3"
          >
            <option value="Stock">Stock</option>
            <option value="ETF">ETF</option>
            <option value="Crypto">Crypto</option>
            <option value="Forex">Forex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Select Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full border rounded-md p-3"
          >
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="LSE">LSE</option>
            <option value="NSE">NSE</option>
            <option value="BSE">BSE</option>
            <option value="HKEX">HKEX</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Enter Stock Symbols (comma separated)
          </label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            placeholder="e.g., AAPL,TSLA"
            className="w-full border rounded-md p-3"
          />
        </div>

        <Button
          onClick={fetchShortTerm}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {/* Result Section */}
      {results.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={downloadCSV}
            className="mb-6 bg-green-600 text-white hover:bg-green-700 px-4 py-2"
          >
            ⬇️ Download Results as CSV
          </Button>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border rounded-md shadow-md">
              <thead className="bg-blue-100 font-semibold">
                <tr>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Current</th>
                  <th className="p-3">Predicted</th>
                  <th className="p-3">RSI</th>
                  <th className="p-3">Volatility</th>
                  <th className="p-3">SL / TP</th>
                  <th className="p-3">Decision</th>
                  <th className="p-3">News</th>
                  <th className="p-3">Final</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res.symbol} className="border-t">
                    <td className="p-3 font-bold">{res.symbol}</td>
                    {"error" in res ? (
                      <td colSpan={8} className="text-red-600 italic">
                        ⚠️ {res.error}
                      </td>
                    ) : (
                      <>
                        <td>{currencySymbol(exchange)}{res.current_price}</td>
                        <td>{currencySymbol(exchange)}{res.predicted_price}</td>
                        <td>{res.rsi}</td>
                        <td>{res.volatility}</td>
                        <td>
                          {currencySymbol(exchange)}{res.stop_loss} / {currencySymbol(exchange)}{res.take_profit}
                        </td>
                        <td>{res.decision}</td>
                        <td>{res.news_sentiment}</td>
                        <td>{getFinalDecision(res.decision, res.news_sentiment)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortTerm;
