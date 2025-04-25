import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/components/Layout";

interface Props {
  base64Image: string;
  symbol: string;
  showConfidence?: boolean;
}

const LSTMChart: React.FC<Props> = ({ base64Image, symbol, showConfidence }) => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // nice little animation time
    return () => clearTimeout(timeout);
  }, [base64Image]);

  if (!base64Image && loading) {
    return (
      <p className={`text-center animate-pulse ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Loading chart...
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
        className="mx-auto max-w-full rounded-md transition-transform duration-300 hover:scale-105"
      />
      <p className={`mt-2 text-center text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {showConfidence ? "Showing prediction + confidence bands." : "Showing prediction only."}
      </p>
    </div>
  );
};

export default LSTMChart;
