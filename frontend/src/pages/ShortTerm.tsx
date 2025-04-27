// src/pages/ShortTerm.tsx
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { toast } from "sonner";

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
  const [assetType, setAssetType] = useState("Stock");
  const [exchange, setExchange] = useState("NASDAQ");
  const [results, setResults] = useState<ShortTermResult[]>([]);
  const [loading, setLoading] = useState(false);

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
      toast.success("✅ Short-Term Analysis Completed!");
    } catch (error) {
      console.error("Short-term analysis failed:", error);
      toast.error("❌ Failed to fetch short-term analysis. Check input or server.");
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
    <div className="p-6 min-h-screen dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">📈 Short-Term Stock Analysis</h1>

      {/* Input Area */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Asset Type */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Select Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="border p-2 rounded-md w-full shadow-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="Stock">Stock</option>
            <option value="ETF">ETF</option>
            <option value="Crypto">Crypto</option>
            <option value="Forex">Forex</option>
          </select>
        </div>

        {/* Exchange */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Select Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="border p-2 rounded-md w-full shadow-sm dark:bg-gray-800 dark:border-gray-600"
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

        {/* Symbols */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Enter Stock Symbols</label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            placeholder="e.g., AAPL, TSLA, GOOGL"
            className="border p-2 rounded-md w-full shadow-sm dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Run Analysis Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={fetchShortTerm} disabled={loading} className="px-6 py-2">
          {loading ? <Loader /> : "🚀 Run Analysis"}
        </Button>

        {results.length > 0 && (
          <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
            ⬇️ Download CSV
          </Button>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-left">Current</th>
                <th className="p-3 text-left">Predicted</th>
                <th className="p-3 text-left">RSI</th>
                <th className="p-3 text-left">Volatility</th>
                <th className="p-3 text-left">SL / TP</th>
                <th className="p-3 text-left">Decision</th>
                <th className="p-3 text-left">News</th>
                <th className="p-3 text-left">Final</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.symbol} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 font-bold">{res.symbol}</td>

                  {"error" in res ? (
                    <td colSpan={8} className="p-3 text-red-600 italic">⚠️ {res.error}</td>
                  ) : (
                    <>
                      <td className="p-3">${res.current_price}</td>
                      <td className="p-3">${res.predicted_price}</td>
                      <td className="p-3">{res.rsi}</td>
                      <td className="p-3">{res.volatility}</td>
                      <td className="p-3">${res.stop_loss} / ${res.take_profit}</td>
                      <td className="p-3">{res.decision}</td>
                      <td className="p-3">{res.news_sentiment}</td>
                      <td className="p-3">{res.final_decision}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShortTerm;
