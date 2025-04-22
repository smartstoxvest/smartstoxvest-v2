import React from 'react';

interface Props {
  base64Image: string;
}

const LSTMChart: React.FC<Props> = ({ base64Image }) => {
     console.log("Base64 Image Length:", base64Image?.length); // ✅ Add this line
  if (!base64Image) {
    console.log("Base64 image not yet loaded...");
    return <p className="text-muted">Chart is loading...</p>;
  }

  console.log("Base64 Image Length:", base64Image.length);

  return (
    <div className="p-4 rounded-xl bg-white shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-center">📈 LSTM Predicted Chart</h2>
      <img
       key={base64Image.slice(0, 20)}  // Add this line to force re-render on change
       src={`data:image/png;base64,${base64Image}`}
       alt="LSTM Prediction Chart"
       className="mx-auto max-w-full rounded-xl border border-gray-300"
      />

    </div>
  );
};

export default LSTMChart;
