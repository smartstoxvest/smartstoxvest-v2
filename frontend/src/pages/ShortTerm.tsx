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
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-8">🚀 Short-Term Stock Analysis</h1>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full border rounded-md p-2"
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
              className="w-full border rounded-md p-2"
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
            <label className="block text-sm font-semibold mb-1">Enter Stock Symbols</label>
            <input
              type="text"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              placeholder="e.g., AAPL, TSLA"
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={fetchShortTerm} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className="flex justify-center mb-6">
            <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white">
              ⬇️ Download Table as CSV
            </Button>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Current</th>
                  <th className="p-2">Predicted</th>
                  <th className="p-2">RSI</th>
                  <th className="p-2">Volatility</th>
                  <th className="p-2">SL / TP</th>
                  <th className="p-2">Decision</th>
                  <th className="p-2">News</th>
                  <th className="p-2">Final</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res.symbol} className="border-t">
                    {"error" in res ? (
                      <td colSpan={9} className="p-2 text-red-600 italic">
                        ⚠️ {res.error}
                      </td>
                    ) : (
                      <>
                        <td className="p-2 font-semibold">{res.symbol}</td>
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
  );
};

export default ShortTerm;
