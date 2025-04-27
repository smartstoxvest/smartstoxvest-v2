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
  signal_conflict?: string;
}

const ShortTerm = () => {
  const [symbols, setSymbols] = useState("AAPL,TSLA");
  const [results, setResults] = useState<ShortTermResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetType, setAssetType] = useState("Stock");
  const [exchange, setExchange] = useState("NASDAQ");

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
    const headers = ["Symbol,Current Price,Predicted,RSI,Volatility,Stop Loss,Take Profit,Decision,News Sentiment,Final Decision"];
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
      <h1 className="text-4xl font-bold mb-8 text-center">🚀 Short-Term Stock Analysis</h1>

      <div className="space-y-6 max-w-lg mx-auto mb-8">
        {/* Select Asset Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
          >
            <option value="Stock">Stock</option>
            <option value="ETF">ETF</option>
            <option value="Crypto">Crypto</option>
            <option value="Forex">Forex</option>
          </select>
        </div>

        {/* Select Exchange */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
          >
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="LSE">LSE</option>
            <option value="NSE">NSE</option>
            <option value="AMEX">AMEX</option>
            <option value="BSE">BSE</option>
            <option value="HKEX">HKEX</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        {/* Stock Symbols Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Enter Stock Symbols (comma separated)</label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            placeholder="e.g. AAPL, TSLA, GOOGL"
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        {/* Run Analysis Button */}
        <Button onClick={fetchShortTerm} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="flex justify-center mb-6">
            <Button onClick={downloadCSV} className="bg-green-600 text-white hover:bg-green-700">
              ⬇️ Download Results as CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Current</th>
                  <th className="px-4 py-2">Predicted</th>
                  <th className="px-4 py-2">RSI</th>
                  <th className="px-4 py-2">Volatility</th>
                  <th className="px-4 py-2">SL / TP</th>
                  <th className="px-4 py-2">Decision</th>
                  <th className="px-4 py-2">News</th>
                  <th className="px-4 py-2">Final</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res.symbol} className="border-t">
                    <td className="px-4 py-2 font-semibold">{res.symbol}</td>

                    {"error" in res ? (
                      <td colSpan={8} className="px-4 py-2 text-red-600 italic text-center">
                        ⚠️ {res.error}
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-2">${res.current_price}</td>
                        <td className="px-4 py-2">${res.predicted_price}</td>
                        <td className="px-4 py-2">{res.rsi}</td>
                        <td className="px-4 py-2">{res.volatility}</td>
                        <td className="px-4 py-2">${res.stop_loss} / ${res.take_profit}</td>
                        <td className="px-4 py-2">{res.decision}</td>
                        <td className="px-4 py-2">{res.news_sentiment}</td>
                        <td className="px-4 py-2">{res.final_decision}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ShortTerm;
