import { useState, useEffect } from "react";
import axios from "axios";
import TopNavigation from "@/components/TopNavigation";

const API_URL = import.meta.env.VITE_API_URL;

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState("");

  // Fetch current watchlist
  useEffect(() => {
    axios
      .get(`${API_URL}/api/watchlist`)
      .then((res) => setWatchlist(res.data))
      .catch((err) => console.error("Failed to fetch watchlist:", err));
  }, []);

  const addSymbol = () => {
    const trimmed = newSymbol.trim().toUpperCase();
    if (!trimmed) return;

    axios
      .post(`${API_URL}/api/watchlist`, { symbol: trimmed })
      .then(() => {
        setWatchlist((prev) => [...prev, trimmed]);
        setNewSymbol("");
      })
      .catch((err) => console.error("Error adding symbol:", err));
  };

  const removeSymbol = (symbol: string) => {
    axios
      .delete(`${API_URL}/api/watchlist/${symbol}`)
      .then(() => {
        setWatchlist((prev) => prev.filter((s) => s !== symbol));
      })
      .catch((err) => console.error("Error removing symbol:", err));
  };

  return (
    <>
      <TopNavigation />
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white">📋 Watchlist</h1>

        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter symbol (e.g. AAPL)"
            className="border rounded px-3 py-2 flex-1 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={addSymbol}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {watchlist.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Your watchlist is empty.</p>
        ) : (
          <ul className="space-y-2">
            {watchlist.map((symbol) => (
              <li
                key={symbol}
                className="flex justify-between items-center border-b py-2 dark:border-gray-700"
              >
                <span className="text-lg text-gray-800 dark:text-gray-200">{symbol}</span>
                <button
                  onClick={() => removeSymbol(symbol)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Watchlist;
