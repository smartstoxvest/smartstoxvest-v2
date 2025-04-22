import { useState, useEffect } from 'react';
import axios from 'axios';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState('');

  // Fetch current watchlist
  useEffect(() => {
    axios.get('/api/watchlist')
      .then(res => setWatchlist(res.data))
      .catch(err => console.error('Failed to fetch watchlist:', err));
  }, []);

  const addSymbol = () => {
    if (!newSymbol) return;

    axios.post('/api/watchlist', { symbol: newSymbol.toUpperCase() })
      .then(() => {
        setWatchlist(prev => [...prev, newSymbol.toUpperCase()]);
        setNewSymbol('');
      })
      .catch(err => console.error('Error adding symbol:', err));
  };

  const removeSymbol = (symbol: string) => {
    axios.delete(`/api/watchlist/${symbol}`)
      .then(() => {
        setWatchlist(prev => prev.filter(s => s !== symbol));
      })
      .catch(err => console.error('Error removing symbol:', err));
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">📋 Watchlist</h1>

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter symbol (e.g. AAPL)"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={addSymbol}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {watchlist.map(symbol => (
          <li key={symbol} className="flex justify-between items-center border-b py-2">
            <span className="text-lg">{symbol}</span>
            <button
              onClick={() => removeSymbol(symbol)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
