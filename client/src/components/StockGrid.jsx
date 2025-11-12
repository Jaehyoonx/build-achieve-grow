// Component: StockGrid
// Purpose: Displays a grid/list of stock cards.
// Users can browse popular stocks and select one for details.

import { useState, useEffect } from 'react';
import StockCard from './StockCard';
import StockDetail from '../views/StockDetail';

export default function StockGrid() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        const response = await fetch('/api/stocks?limit=50');
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('Failed to load stocks');
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  if (loading) {
    return <p>Loading stock data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (selectedSymbol) {
    return (
      <StockDetail 
        symbol={selectedSymbol} 
        onBack={() => setSelectedSymbol(null)}
      />
    );
  }

  return (
    <div className="stock-grid">
      {stocks.map(stock =>
        <StockCard
          key={stock.Symbol}
          symbol={stock.Symbol}
          currentPrice={stock.Close}
          previousClose={stock.AdjClose}
          onClick={() => setSelectedSymbol(stock.Symbol)}
        />
      )}
    </div>
  );
}
