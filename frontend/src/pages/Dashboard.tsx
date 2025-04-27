import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
        📊 Smart<span className="text-blue-600">Stox</span>Vest
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        Welcome to <strong>SmartStoxVest</strong>, your <em>AI-powered dashboard</em> for short-, medium-, and long-term stock investment analysis. 
        Pick a strategy and let insights flow like the river of profits. 🚀
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          className="text-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/short-term")}
        >
          📈 Short-Term Analysis
        </Button>

        <Button
          className="text-lg px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/medium-term")}
        >
          🔮 Medium-Term Forecast
        </Button>

        <Button
          className="text-lg px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/long-term")}
        >
          📉 Long-Term Risk
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
