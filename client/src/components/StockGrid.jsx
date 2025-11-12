// Component: StockGrid
// Purpose: Displays a grid/list of stock cards.
// Users can browse popular stocks and select one for details.

import { useState } from 'react';
import StockCard from './StockCard';
import StockDetail from '../views/StockDetail';

export default function StockGrid({ stocks }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

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
          key={stock.symbol}
          symbol={stock.symbol}
          companyName={stock.companyName}
          currentPrice={stock.currentPrice}
          previousClose={stock.previousClose}
          onClick={() => setSelectedSymbol(stock.symbol)}
        />
      )}
    </div>
  );
}
