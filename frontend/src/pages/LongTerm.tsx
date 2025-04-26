import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
const API_URL = import.meta.env.VITE_API_URL;

interface LongTermResult {
  symbol: string;
  last_price: number;
  predicted_price: number;
  worst_case: number;
  best_case: number;
  decision: string;
}

const LongTerm = () => {
  const [symbols, setSymbols] = useState("AAPL,TSLA,GOOGL");
  const [results, setResults] = useState<LongTermResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLongTerm = async () => {
    setLoading(true);
    try {
      const symbolsArray = symbols
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const newResults: LongTermResult[] = [];

      for (const symbol of symbolsArray) {
        const response = await axios.post(`${API_URL}/long/predict`, {
          symbol,
          exchange: "NASDAQ",
          period: "5y",
          simulations: 1000,
        });

        console.log(`📦 Response for ${symbol}:`, response.data);

        newResults.push({
          symbol: response.data.symbol,
          last_price: response.data.current_price,
          predicted_price: (response.data.current_price + response.data.best_case) / 2,
          worst_case: response.data.worst_case,
          best_case: response.data.best_case,
          decision: response.data.decision,
        });
      }

      setResults(newResults);
    } catch (err) {
      console.error("Error fetching long-term analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Symbol,Last Price,Predicted,Worst Case,Best Case,Decision"];
    const rows = results.map((r) =>
      `${r.symbol},${r.last_price},${r.predicted_price},${r.worst_case},${r.best_case},${r.decision}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "long_term_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSummary = () => {
    return results.map((r) => {
      const spread = r.best_case - r.worst_case;
      const riskLabel = spread < r.last_price * 0.2 ? "low risk" : spread < r.last_price * 0.4 ? "moderate risk" : "high risk";
      const trend = r.predicted_price > r.last_price * 1.05 ? "expected to grow" : r.predicted_price < r.last_price * 0.95 ? "expected to decline" : "likely stable";
      return `\ud83d\udccc ${r.symbol} is ${trend} with ${riskLabel}. Recommended action: ${r.decision}.`;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">\ud83d\udcc9 Long-Term Risk Analysis</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="e.g. AAPL, TSLA, GOOGL"
          className="border px-4 py-2 rounded-md w-full max-w-md"
        />
        <Button onClick={fetchLongTerm} disabled={loading}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {results.length > 0 && (
        <>
          <Button onClick={downloadCSV} className="bg-green-600 text-white hover:bg-green-700 mb-4">
            \u2b07\ufe0f Download Table as CSV
          </Button>

          <div className="overflow-x-auto rounded-md shadow border mb-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Last Price</th>
                  <th className="px-4 py-2 text-left">Predicted</th>
                  <th className="px-4 py-2 text-left">Worst Case</th>
                  <th className="px-4 py-2 text-left">Best Case</th>
                  <th className="px-4 py-2 text-left">Decision</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.symbol} className="border-t">
                    <td className="px-4 py-2 font-semibold">{r.symbol}</td>
                    <td className="px-4 py-2">${r.last_price}</td>
                    <td className="px-4 py-2">${r.predicted_price}</td>
                    <td className="px-4 py-2">${r.worst_case}</td>
                    <td className="px-4 py-2">${r.best_case}</td>
                    <td className="px-4 py-2">{r.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
            <h3 className="text-lg font-semibold mb-1">\ud83d\udccc Strategic Summary</h3>
            <ul className="list-disc list-inside space-y-1">
              {generateSummary().map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default LongTerm;
