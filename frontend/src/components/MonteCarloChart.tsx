import React from "react";

interface MonteCarloChartProps {
  symbol: string;
  base64Image: string;
}

export const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ symbol, base64Image }) => {
  if (!base64Image) {
    return <p>📉 No chart data available for {symbol}</p>;
  }

  return (
    <div className="mb-6 border p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">📊 Monte Carlo Simulation for {symbol}</h3>
      <img
        src={`data:image/png;base64,${base64Image}`}
        alt={`Monte Carlo simulation for ${symbol}`}
        className="w-full h-auto rounded"
      />
    </div>
  );
};
