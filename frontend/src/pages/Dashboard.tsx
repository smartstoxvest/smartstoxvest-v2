
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">📊 SmartStoxVest</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Welcome to SmartStoxVest, your AI-powered dashboard for short-, medium-, and long-term stock investment analysis. Pick a strategy and let insights flow.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          className="text-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/short-term")}
        >
          🚀 Short-Term Analysis
        </Button>

        <Button
          className="text-lg px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate("/medium-term")}
        >
          🔮 Medium-Term Forecast
        </Button>

        <Button
          className="text-lg px-6 py-3 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => navigate("/long-term")}
        >
          📉 Long-Term Risk
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;