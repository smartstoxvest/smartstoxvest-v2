import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10 text-center">
      <div className="w-full max-w-md mx-auto px-4">

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-white break-words">
          📊 <span className="text-black">Smart</span>
          <span className="text-blue-600">Stox</span>
          <span className="text-black">Vest</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8">
          Welcome to <strong>SmartStoxVest</strong>, your <em>AI-powered dashboard</em> for short-, medium-, and long-term stock investment analysis.
          Pick a strategy and let insights flow like the river of profits. 🚀
        </p>

        <div className="space-y-4">
          <Button
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/short-term")}
          >
            📈 Short-Term Analysis
          </Button>

          <Button
            className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/medium-term")}
          >
            🔮 Medium-Term Forecast
          </Button>

          <Button
            className="w-full py-3 text-lg bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/long-term")}
          >
            📉 Long-Term Risk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
