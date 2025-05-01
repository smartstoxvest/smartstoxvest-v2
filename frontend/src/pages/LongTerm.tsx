import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

const LongTerm: React.FC = () => {
  const [assetType, setAssetType] = useState("Stock");
  const [exchange, setExchange] = useState("NASDAQ");
  const [symbols, setSymbols] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"line" | "area">("line");

  const exchangeSuffix: Record<string, string> = {
    LSE: ".L",
    NASDAQ: "",
    NYSE: "",
    NSE: ".NS",
    BSE: ".BO",
    AMEX: "",
    HKEX: ".HK",
    Crypto: "-USD",
  };

  const currencySymbolMap: Record<string, string> = {
    LSE: "£",
    NASDAQ: "$",
    NYSE: "$",
    NSE: "₹",
    BSE: "₹",
    AMEX: "$",
    HKEX: "HK$",
    Crypto: "",
  };

  const currencySymbol = currencySymbolMap[exchange] || "$";

  const stripSymbolSuffix = (symbol: string) =>
    symbol.replace(/(\.L|\.NS|\.BO|\.HK|-USD)$/i, "");

  const runLongTermAnalysis = async () => {
    setLoading(true);
    setSelectedStock(null);
    const stockList = symbols
      .split(",")
      .map((s) => s.trim().toUpperCase() + (exchangeSuffix[exchange] || ""));

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_BASE_URL}/longterm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbols: stockList,
          simulations: 1000,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("API error", error);
    }
    setLoading(false);
  };

  const generateChartData = (pricePaths: number[][]) => {
    const datasets = pricePaths.slice(0, 50).map((path, idx) => ({
      label: `Sim ${idx + 1}`,
      data: path,
      borderColor: "rgba(75,192,192,0.3)",
      borderWidth: 1,
      pointRadius: 0,
      fill: chartType === "area" ? "origin" : false,
    }));

    return {
      labels: Array.from({ length: pricePaths[0].length }, (_, i) => i + 1),
      datasets,
    };
  };

  const downloadCSV = () => {
    if (!response?.results?.length) return;

    const rows = [
      [
        "Symbol",
        "Current Price",
        "Predicted Price",
        "SMA200",
        "Volatility",
        "Worst Case",
        "Best Case",
        "Expected Return (%)",
        "Decision",
      ],
      ...response.results.map((res: any) => {
        const expectedReturn = ((res.best_case - res.current_price) / res.current_price) * 100;
        return [
          stripSymbolSuffix(res.symbol),
          res.current_price.toFixed(2),
          res.predicted_price?.toFixed(2),
          res.sma200?.toFixed(2),
          res.volatility?.toFixed(4),
          res.worst_case.toFixed(2),
          res.best_case.toFixed(2),
          expectedReturn.toFixed(2),
          res.decision,
        ];
      }),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "long_term_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <span role="img">📉</span> Long-Term Risk Analysis
      </h1>

      <div className="max-w-2xl mx-auto flex flex-col space-y-6 mb-8">

        <div>
          <label className="block text-sm font-medium mb-1">Select Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>Stock</option>
            <option>ETF</option>
            <option>Crypto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>NASDAQ</option>
            <option>NYSE</option>
            <option>LSE</option>
            <option>NSE</option>
            <option>BSE</option>
            <option>AMEX</option>
            <option>HKEX</option>
            <option>Crypto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Enter Stock Symbols (comma separated)</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="e.g. TSLA, AAPL"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
          />
        </div>

        <button
          onClick={runLongTermAnalysis}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full md:w-auto"
        >
          Run Analysis
        </button>
      </div>

      {loading && <p className="text-sm text-gray-600">⏳ Running Monte Carlo simulation...</p>}

      {response?.results?.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-1">
              <span role="img">📋</span> Summary Table
            </h3>
            <button
              onClick={downloadCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
            >
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
			<table className="min-w-full text-sm text-center border rounded-md shadow-md">
				<thead className="bg-blue-100 font-semibold">
				<tr>
					{[
					"Symbol",
					"Current",
					"Worst Case",
					"Best Case",
					"Expected Return",
					"SMA200",
					"Volatility",
					"Decision",
					].map((header) => (
					<th key={header} className="p-3">{header}</th>
					))}
				</tr>
				</thead>
				<tbody>
					{response.results.map((res: any, idx: number) => {
						const expectedReturn = ((res.best_case - res.current_price) / res.current_price) * 100;

						const badgeClass =
						res.decision === "Buy"
							? "bg-green-500 text-white"
							: res.decision === "Sell"
							? "bg-red-500 text-white"
							: res.decision === "Hold"
							? "bg-yellow-400 text-black"
							: "bg-gray-400 text-white";

						return (
						<tr key={idx} className="border-t">
							<td className="p-3 font-bold">{stripSymbolSuffix(res.symbol)}</td>
							<td>{currencySymbol}{res.current_price.toFixed(2)}</td>
							<td>{currencySymbol}{res.worst_case?.toFixed(2)}</td>
							<td>{currencySymbol}{res.best_case?.toFixed(2)}</td>
							<td>{expectedReturn.toFixed(2)}%</td>
							<td>{res.sma200 ? `${currencySymbol}${res.sma200.toFixed(2)}` : "N/A"}</td>
							<td>{res.volatility ? res.volatility.toFixed(4) : "N/A"}</td>
							<td>
							<span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
								{res.decision || "N/A"}
							</span>
							</td>
						</tr>
						);
					})}
					</tbody>

			</table>
		</div>


          <div className="mt-8">
            <label className="block font-medium mb-2">
              <span role="img">🎯</span> Select a stock to view simulation chart:
            </label>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => setSelectedStock(e.target.value)}
              value={selectedStock || ""}
            >
              <option value="">-- Select Stock --</option>
              {response.results.map((res: any) => (
                <option key={res.symbol} value={res.symbol}>
                  {stripSymbolSuffix(res.symbol)}
                </option>
              ))}
            </select>

            <div className="flex items-center mt-4">
              <label className="mr-3">Chart Type:</label>
              <select
                className="border p-2 rounded"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as "line" | "area")}
              >
                <option value="line">Line</option>
                <option value="area">Area</option>
              </select>
            </div>
          </div>

          {selectedStock && (
            <div className="mt-10">
              <h4 className="text-lg font-semibold mb-2">
                📈 Monte Carlo Simulations for {stripSymbolSuffix(selectedStock)}
              </h4>
              <Line
                data={generateChartData(
                  response.results.find((res: any) => res.symbol === selectedStock).price_paths
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LongTerm;
