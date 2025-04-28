import { useState } from "react";
import axios from "axios";
import LSTMChart from "@/components/LSTMChart";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

interface PredictionData {
  predictedPrice?: number;
  currentPrice?: number;
  chartBase64?: string;
  confidenceLow?: number;
  confidenceHigh?: number;
  recommendation?: string;
  error?: string;
}

const MediumTerm = () => {
  const [symbols, setSymbols] = useState("AAPL,TSLA");
  const [exchange, setExchange] = useState("NASDAQ");
  const [assetType, setAssetType] = useState("Stock");
  const [results, setResults] = useState<{ [symbol: string]: PredictionData }>({});
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const currencySymbol = (exchange: string) => {
    switch (exchange) {
      case "LSE": return "£";
      case "NSE": case "BSE": return "₹";
      case "HKEX": return "HK$";
      default: return "$";
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const symbolsList = symbols.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
      const res = await axios.post(`${API_URL}/medium/predict`, {
        symbol: symbols,
        exchange,
        asset_type: assetType,
        period: "2y",
        epochs: 5,
        future_days: 30,
      });

      const newResults: { [symbol: string]: PredictionData } = {};
      res.data.forEach((item: any) => {
        newResults[item.symbol] = item.error
          ? { error: item.error }
          : {
              predictedPrice: item.end_price ?? 0,
              currentPrice: item.current_price ?? 0,
              chartBase64: item.chart_base64,
              confidenceLow: item.lower_bounds[0] ?? 0,
              confidenceHigh: item.upper_bounds[0] ?? 0,
              recommendation: item.recommendation ?? "Hold",
            };
      });

      setResults(newResults);
      if (symbolsList.length > 0) setSelectedChartSymbol(symbolsList[0]);
    } catch (err: any) {
      console.error("❌ Error fetching Medium-Term Predictions:", err.response?.data || err.message || err);
      alert("❌ Failed to fetch Medium-Term Predictions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Symbol,Current Price,Predicted Price,Confidence Low,Confidence High,Recommendation,Error"];
    const rows = Object.entries(results).map(([symbol, data]) =>
      `${symbol},${data.currentPrice ?? ""},${data.predictedPrice ?? ""},${data.confidenceLow ?? ""},${data.confidenceHigh ?? ""},${data.recommendation ?? ""},${data.error ?? ""}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "medium_term_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSummary = () => {
    return Object.entries(results).map(([symbol, data]) => {
      if (data.error) {
        return `⚠️ ${symbol}: ${data.error}`;
      }
      const spread = (data.confidenceHigh ?? 0) - (data.confidenceLow ?? 0);
      const confidenceStrength = spread <= 10 ? "high confidence" : "moderate confidence";
      const trend = (data.predictedPrice ?? 0) > (data.confidenceHigh ?? 0) - 2 ? "rising" : "stable";
      const trendIcon = trend === "rising" ? "🔼" : "➖";
      const recIcon = data.recommendation === "Buy" ? "✅" : data.recommendation === "Sell" ? "❌" : "⚠️";
      return `${trendIcon} ${symbol} is ${trend} with ${confidenceStrength}. ${recIcon} Action: ${data.recommendation}.`;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📈 Medium-Term Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="border p-2 rounded">
          <option value="Stock">Stock</option>
          <option value="ETF">ETF</option>
          <option value="Crypto">Crypto</option>
          <option value="Forex">Forex</option>
        </select>
        <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="border p-2 rounded">
          <option value="NASDAQ">NASDAQ</option>
          <option value="NYSE">NYSE</option>
          <option value="LSE">LSE</option>
          <option value="NSE">NSE</option>
          <option value="BSE">BSE</option>
          <option value="AMEX">AMEX</option>
          <option value="HKEX">HKEX</option>
          <option value="Crypto">Crypto</option>
        </select>
        <input type="text" value={symbols} onChange={(e) => setSymbols(e.target.value)} placeholder="e.g., AAPL, TSLA, GOOGL" className="border p-2 rounded" />
        <Button onClick={fetchPredictions} disabled={loading} className="bg-blue-600 text-white">
          {loading ? "Predicting..." : "Run Prediction"}
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={downloadCSV} className="bg-green-600 text-white">
              ⬇️ Download CSV
            </Button>
          </div>

          <div className="overflow-x-auto rounded shadow mb-6">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Current Price</th>
                  <th className="px-4 py-2">Predicted Price</th>
                  <th className="px-4 py-2">Confidence Range</th>
                  <th className="px-4 py-2">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results).map(([symbol, data]) => (
                  <tr key={symbol} className="border-t">
                    <td className="px-4 py-2 font-semibold">{symbol}</td>
                    {data.error ? (
                      <td colSpan={4} className="px-4 py-2 text-red-500 font-semibold">⚠️ {data.error}</td>
                    ) : (
                      <>
                        <td className="px-4 py-2">{currencySymbol(exchange)}{data.currentPrice}</td>
                        <td className="px-4 py-2">{currencySymbol(exchange)}{data.predictedPrice}</td>
                        <td className="px-4 py-2">{currencySymbol(exchange)}{data.confidenceLow} - {currencySymbol(exchange)}{data.confidenceHigh}</td>
                        <td className="px-4 py-2">
                          {data.recommendation === "Buy" ? "✅ Buy" : data.recommendation === "Sell" ? "❌ Sell" : "⚠️ Hold"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
            <h3 className="text-lg font-semibold mb-2">🧠 Smart Summary</h3>
            <ul className="list-disc list-inside space-y-1">
              {generateSummary().map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          {selectedChartSymbol && results[selectedChartSymbol] && results[selectedChartSymbol].chartBase64 && (
            <LSTMChart
              base64Image={results[selectedChartSymbol].chartBase64!}
              symbol={selectedChartSymbol}
              showConfidence={showConfidence}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MediumTerm;
