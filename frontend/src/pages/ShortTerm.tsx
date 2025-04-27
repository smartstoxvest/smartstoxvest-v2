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
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        🚀 Short-Term Stock Analysis
      </h1>

      {/* FORM AREA */}
      <div className="max-w-2xl mx-auto space-y-6 mb-10">

        {/* Select Asset Type */}
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

        {/* Select Exchange */}
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
            <option value="AMEX">AMEX</option>
            <option value="BSE">BSE</option>
            <option value="HKEX">HKEX</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        {/* Enter Stock Symbols */}
        <div>
          <label className="block text-sm font-semibold mb-2">Enter Stock Symbols (comma separated)</label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            placeholder="e.g., AAPL,TSLA"
            className="w-full border rounded-md p-3"
          />
        </div>

        {/* Run Analysis Button */}
        <div>
          <Button
            onClick={fetchShortTerm}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg"
          >
            {loading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      {results.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={downloadCSV}
            className="mb-6 bg-green-600 text-white hover:bg-green-700 px-4 py-2"
          >
            ⬇️ Download Results as CSV
          </Button>

          {/* SUPERCHARGED TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Symbol</th>
                  <th className="px-6 py-3 text-left">Current</th>
                  <th className="px-6 py-3 text-left">Predicted</th>
                  <th className="px-6 py-3 text-left">RSI</th>
                  <th className="px-6 py-3 text-left">Volatility</th>
                  <th className="px-6 py-3 text-left">SL / TP</th>
                  <th className="px-6 py-3 text-left">Decision</th>
                  <th className="px-6 py-3 text-left">News</th>
                  <th className="px-6 py-3 text-left">Final</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((res) => (
                  <tr key={res.symbol} className="hover:bg-blue-50">
                    <td className="px-6 py-4 font-bold text-gray-700">{res.symbol}</td>
                    {"error" in res ? (
                      <td colSpan={8} className="px-6 py-4 text-red-600 italic">
                        ⚠️ {res.error}
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">${res.current_price}</td>
                        <td className="px-6 py-4">${res.predicted_price}</td>
                        <td className="px-6 py-4">{res.rsi}</td>
                        <td className="px-6 py-4">{res.volatility}</td>
                        <td className="px-6 py-4">${res.stop_loss} / ${res.take_profit}</td>
                        <td className="px-6 py-4">{res.decision}</td>
                        <td className="px-6 py-4">{res.news_sentiment}</td>
                        <td className="px-6 py-4">{res.final_decision}</td>
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
