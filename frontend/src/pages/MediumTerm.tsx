import { useState } from "react";
import axios from "axios";
import LSTMChart from "@/components/LSTMChart";
import { Button } from "@/components/ui/button";

type PredictionData = {
  predictedPrice: number;
  chartBase64: string;
  confidenceLow: number;
  confidenceHigh: number;
  recommendation: string;
};

const MediumTerm = () => {
  const [symbolInput, setSymbolInput] = useState("AAPL,TSLA,GOOGL");
  const [results, setResults] = useState<{ [symbol: string]: PredictionData }>({});
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>("");
  const [showConfidence, setShowConfidence] = useState<boolean>(false);

  const fetchPredictions = async () => {
    const symbols = symbolInput
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const newResults: { [symbol: string]: PredictionData } = {};

    for (const symbol of symbols) {
      try {
        const res = await axios.post(`http://localhost:8000/api/medium/predict`, {
          symbol,
          exchange: "NASDAQ", // or whatever the user selects — hardcoded for now
          period: "2y",
          epochs: 5,
          future_days: 30,
        });
        console.log(`📦 Response for ${symbol}:`, res.data);

        newResults[symbol] = {
          predictedPrice: res.data.end_price ?? 205,
          chartBase64: res.data.chart_base64,
          confidenceLow: res.data.lower_bounds?.[res.data.lower_bounds.length - 1] ?? 195,
          confidenceHigh: res.data.upper_bounds?.[res.data.upper_bounds.length - 1] ?? 215,
          recommendation: res.data.recommendation ?? "Hold",
        };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
      }
    }

    setResults(newResults);
    if (symbols.length > 0) setSelectedChartSymbol(symbols[0]);
  };

  const generateSummary = () => {
    return Object.entries(results).map(([symbol, data]) => {
      const { predictedPrice, confidenceLow, confidenceHigh, recommendation } = data;
      const spread = confidenceHigh - confidenceLow;
      const confidenceStrength = spread <= 10 ? "high confidence" : "moderate confidence";
      const trend = predictedPrice > confidenceHigh - 2 ? "rising" : "stable";
      const trendIcon = trend === "rising" ? "🔼" : "➖";
      const recIcon = recommendation === "Buy" ? "✅" : recommendation === "Sell" ? "❌" : "⚠️";

      return `${trendIcon} ${symbol} is predicted to be ${trend} with ${confidenceStrength}. ${recIcon} Action: ${recommendation}.`;
    });
  };

  const downloadCSV = () => {
    const headers = ["Symbol,Predicted Price,Confidence Low,Confidence High,Recommendation"];
    const rows = Object.entries(results).map(([symbol, data]) =>
      `${symbol},${data.predictedPrice},${data.confidenceLow},${data.confidenceHigh},${data.recommendation}`
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

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">📈 Medium-Term Prediction</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={symbolInput}
          onChange={(e) => setSymbolInput(e.target.value)}
          placeholder="e.g. AAPL, TSLA, GOOGL"
          className="border px-4 py-2 rounded-md w-full max-w-md"
        />
        <Button onClick={fetchPredictions}>Predict</Button>
      </div>

      {Object.keys(results).length > 0 && (
        <>
          <Button
            onClick={downloadCSV}
            className="bg-green-600 text-white hover:bg-green-700 mb-6"
          >
            ⬇️ Download Table as CSV
          </Button>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
            <h3 className="text-lg font-semibold mb-1">🧠 Smart Summary</h3>
            <ul className="list-disc list-inside space-y-1">
              {generateSummary().map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="overflow-x-auto rounded-md shadow border mb-6">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Predicted Price</th>
                  <th className="px-4 py-2 text-left">Confidence Range</th>
                  <th className="px-4 py-2 text-left">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results).map(([symbol, data]) => (
                  <tr key={symbol} className="border-t">
                    <td className="px-4 py-2 font-semibold">{symbol}</td>
                    <td className="px-4 py-2">${data.predictedPrice}</td>
                    <td className="px-4 py-2">
                      ${data.confidenceLow} – ${data.confidenceHigh}
                    </td>
                    <td className="px-4 py-2">
                      {data.recommendation === "Buy"
                        ? "✅ Buy"
                        : data.recommendation === "Sell"
                        ? "❌ Sell"
                        : "⚠️ Hold"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <label className="mr-2 font-semibold">View Chart For:</label>
            <select
              value={selectedChartSymbol}
              onChange={(e) => setSelectedChartSymbol(e.target.value)}
              className="border rounded-md p-2"
            >
              {Object.keys(results).map((sym) => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <label className="font-semibold">Chart Mode:</label>
            <select
              value={showConfidence ? "confidence" : "prediction"}
              onChange={(e) => setShowConfidence(e.target.value === "confidence")}
              className="border rounded-md p-2"
            >
              <option value="prediction">Prediction Only</option>
              <option value="confidence">Prediction + Confidence Bands</option>
            </select>
          </div>

          {selectedChartSymbol && results[selectedChartSymbol] && (
            <LSTMChart
              base64Image={results[selectedChartSymbol].chartBase64}
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
