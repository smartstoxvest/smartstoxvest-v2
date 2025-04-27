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
        },
      );
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
    <div className="min-h-screen flex justify-center items-start py-10 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">🚀 Short-Term Stock Analysis</h1>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="border w-full p-2 rounded-md"
            >
              <option value="Stock">Stock</option>
              <option value="ETF">ETF</option>
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Select Exchange</label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="border w-full p-2 rounded-md"
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

          <div>
            <label className="block text-sm font-semibold mb-1">Enter Stock Symbols (comma separated)</label>
            <input
              type="text"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              placeholder="e.g. AAPL, TSLA, GOOGL"
              className="border w-full p-2 rounded-md"
            />
          </div>
        </div>

        <Button
          onClick={fetchShortTerm}
          disabled={loading}
          className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white mb-8"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>

        {results.length > 0 && (
          <>
            <Button
              onClick={downloadCSV}
              className="w-full text-lg bg-green-600 hover:bg-green-700 text-white mb-6"
            >
              ⬇️ Download Table as CSV
            </Button>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2 text-left">Current</th>
                    <th className="p-2 text-left">Predicted</th>
                    <th className="p-2 text-left">RSI</th>
                    <th className="p-2 text-left">Volatility</th>
                    <th className="p-2 text-left">SL / TP</th>
                    <th className="p-2 text-left">Decision</th>
                    <th className="p-2 text-left">News</th>
                    <th className="p-2 text-left">Final</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res) => (
                    <tr key={res.symbol} className="border-t">
                      <td className="p-2 font-semibold">{res.symbol}</td>
                      {"error" in res ? (
                        <td colSpan={8} className="p-2 text-red-600 italic">
                          ⚠️ {res.error}
                        </td>
                      ) : (
                        <>
                          <td className="p-2">${res.current_price}</td>
                          <td className="p-2">${res.predicted_price}</td>
                          <td className="p-2">{res.rsi}</td>
                          <td className="p-2">{res.volatility}</td>
                          <td className="p-2">${res.stop_loss} / ${res.take_profit}</td>
                          <td className="p-2">{res.decision}</td>
                          <td className="p-2">{res.news_sentiment}</td>
                          <td className="p-2">{res.final_decision}</td>
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
    </div>
  );
};

export default ShortTerm;
