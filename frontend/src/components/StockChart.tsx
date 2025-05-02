// src/components/StockChart.tsx
import React from "react";
import Plot from "react-plotly.js";

interface ChartData {
  dates: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  sma50: number[];
  sma200: number[];
  rsi: number[];
}

interface StockChartProps {
  data: ChartData | null;
  type?: "candlestick" | "sma" | "rsi";
}

const StockChart: React.FC<StockChartProps> = ({ data, type }) => {
  if (!data) return null;

  return (
    <div className="space-y-10">
      {(!type || type === "candlestick") && (
        <div>
          <h2 className="text-xl font-bold mb-2">📈 Candlestick Chart</h2>
          <Plot
            data={[
              {
                x: data.dates,
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                type: "candlestick",
                name: "Candlestick",
              },
            ]}
            layout={{ width: 800, height: 400, title: "Candlestick Chart" }}
          />
        </div>
      )}

      {(!type || type === "sma") && (
        <div>
          <h2 className="text-xl font-bold mb-2">📊 Moving Averages (SMA50 & SMA200)</h2>
          <Plot
            data={[
              { x: data.dates, y: data.close, type: "scatter", mode: "lines", name: "Close" },
              { x: data.dates, y: data.sma50, type: "scatter", mode: "lines", name: "SMA50" },
              { x: data.dates, y: data.sma200, type: "scatter", mode: "lines", name: "SMA200" },
            ]}
            layout={{ width: 800, height: 400, title: "Moving Averages" }}
          />
        </div>
      )}

      {(!type || type === "rsi") && (
        <div>
          <h2 className="text-xl font-bold mb-2">📉 Relative Strength Index (RSI)</h2>
          <Plot
            data={[
              {
                x: data.dates,
                y: data.rsi,
                type: "scatter",
                mode: "lines",
                name: "RSI",
                line: { color: "blue" },
              },
            ]}
            layout={{
              width: 800,
              height: 300,
              title: "RSI (Relative Strength Index)",
              yaxis: { range: [0, 100] },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StockChart;
