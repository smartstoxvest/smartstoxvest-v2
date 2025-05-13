import { useState } from "react";
import axios from "axios";
import LSTMChart from "@/components/LSTMChart";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

interface PredictionData {
  predictedPrice?: number;
  chartBase64?: string;
  confidenceLow?: number;
  confidenceHigh?: number;
  recommendation?: string;
  error?: string;
}

const MediumTerm = () => {
  const [symbols, setSymbols] = useState("");
  const [exchange, setExchange] = useState("NASDAQ");
  const [assetType, setAssetType] = useState("Stock");
  const [results, setResults] = useState<{ [symbol: string]: PredictionData }>({});
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>("");
  const [showConfidence, setShowConfidence] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const currencySymbol = (exchange: string) => {
    switch (exchange) {
      case "LSE": return "£";
      case "NSE":
      case "BSE": return "₹";
      case "HKEX": return "HK$";
      default: return "$";
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    try {
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
              chartBase64: item.chart_base64,
              confidenceLow: item.lower_bounds[0] ?? 0,
              confidenceHigh: item.upper_bounds[0] ?? 0,
              recommendation: item.recommendation ?? "Hold",
            };
      });

      setResults(newResults);
      const list = Object.keys(newResults);
      if (list.length > 0) setSelectedChartSymbol(list[0]);
    } catch (err: any) {
      console.error("❌ Error fetching Medium-Term Predictions:", err.response?.data || err.message || err);
      alert("❌ Failed to fetch Medium-Term Predictions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Symbol,Predicted Price,Confidence Low,Confidence High,Confidence Spread,Recommendation,Error"];
    const rows = Object.entries(results).map(([symbol, data]) => {
      const spread = (data.confidenceHigh ?? 0) - (data.confidenceLow ?? 0);
      return `${symbol},${data.predictedPrice ?? ""},${data.confidenceLow ?? ""},${data.confidenceHigh ?? ""},${spread.toFixed(2)},${data.recommendation ?? ""},${data.error ?? ""}`;
    });
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
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        📊 Medium-Term Stock Analysis
      </h1>

      <div className="max-w-2xl mx-auto space-y-6 mb-10">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Asset Type</label>
          <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="w-full border rounded-md p-3">
            {["Stock", "ETF", "Crypto", "Forex"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Select Exchange</label>
          <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="w-full border rounded-md p-3">
            {["NASDAQ-USA", "NYSE-USA", "LSE-UK", "NSE-India", "BSE-India", "HKEX-Hongkong", "Crypto"].map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Enter Stock Symbols (comma separated)</label>
          <input
			type="text"
			value={symbols}
			onChange={(e) => setSymbols(e.target.value)}
			placeholder="e.g. TSLA, AAPL"
			className="w-full border rounded-md p-3"
		  />
        </div>

        <Button onClick={fetchPredictions} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg">
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <Button onClick={downloadCSV} className="bg-green-600 text-white hover:bg-green-700">
              ⬇️ Download CSV
            </Button>
          </div>

          <div className="overflow-x-auto mb-6 rounded-md shadow border">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-blue-100 font-semibold">
                <tr>
                  {[
                    "Symbol",
                    "Predicted",
                    "Confidence Range",
                    "Spread",
                    "Recommendation"
                  ].map((h) => <th key={h} className="p-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>
				{Object.entries(results).map(([symbol, data]) => {
					const spread = (data.confidenceHigh ?? 0) - (data.confidenceLow ?? 0);
					const recommendation = data.recommendation || "Unknown";

					const badgeClass = recommendation.includes("Buy")
					? "bg-green-500 text-white"
					: recommendation.includes("Sell")
					? "bg-red-500 text-white"
					: recommendation.includes("Hold")
					? "bg-yellow-400 text-black"
					: "bg-gray-400 text-white";

					return (
					<tr key={symbol} className="border-t">
						<td className="p-3 font-bold">{symbol}</td>
						{data.error ? (
						<td colSpan={4} className="text-red-500 italic">⚠️ {data.error}</td>
						) : (
						<>
							<td>{currencySymbol(exchange)}{data.predictedPrice?.toFixed(2)}</td>
							<td>
							{currencySymbol(exchange)}{data.confidenceLow?.toFixed(2)} - {currencySymbol(exchange)}{data.confidenceHigh?.toFixed(2)}
							</td>
							<td>{spread.toFixed(2)}</td>
							<td>
							<span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
								{recommendation}
							</span>
							</td>
						</>
						)}
					</tr>
					);
				})}
				</tbody>

            </table>
          </div>

          {selectedChartSymbol && results[selectedChartSymbol]?.chartBase64 && (
            <>
              <div className="mb-4">
                <label className="mr-2 font-semibold">View Chart For:</label>
                <select value={selectedChartSymbol} onChange={(e) => setSelectedChartSymbol(e.target.value)} className="border rounded-md p-2">
                  {Object.keys(results).map((sym) => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <label className="font-semibold">Chart Mode:</label>
                <select value={showConfidence ? "confidence" : "prediction"} onChange={(e) => setShowConfidence(e.target.value === "confidence")} className="border rounded-md p-2">
                  <option value="prediction">Prediction Only</option>
                  <option value="confidence">Prediction + Confidence Bands</option>
                </select>
              </div>

              <LSTMChart base64Image={results[selectedChartSymbol].chartBase64!} symbol={selectedChartSymbol} showConfidence={showConfidence} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MediumTerm;
