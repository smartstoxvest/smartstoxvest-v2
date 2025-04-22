import React from "react";
import { useDarkMode } from "@/components/Layout";


interface Props {
  base64Image: string;
  symbol: string;
  showConfidence?: boolean;
}

const LSTMChart: React.FC<Props> = ({ base64Image, symbol }) => {
  const { darkMode } = useDarkMode();

  if (!base64Image) {
    return (
      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Chart is loading...
      </p>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl shadow-md border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        📉 LSTM Chart for {symbol}
      </h2>
      <img
        key={base64Image.slice(0, 20)}
        src={`data:image/png;base64,${base64Image}`}
        alt={`${symbol} Prediction Chart`}
        className="mx-auto max-w-full rounded-md"
      />
    </div>
  );
};

export default LSTMChart;
