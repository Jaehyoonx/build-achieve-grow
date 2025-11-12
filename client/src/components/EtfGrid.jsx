// Component: EtfGrid
// Purpose: Displays a grid/list of ETF cards.
// Users can browse popular ETFs and select one for more details.
import { useState } from 'react';
import EtfCard from './EtfCard';
import EtfDetail from '../views/EtfDetail';

export default function EtfGrid({ etfs }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  if (selectedSymbol) {
    return (
      <EtfDetail 
        symbol={selectedSymbol}
        onBack={() => setSelectedSymbol(null)}
      />
    );
  }

  return (
    <div className="etf-grid">
      {etfs.map(etf => (
        <EtfCard
          key={etf.symbol}
          symbol={etf.symbol}
          etfName={etf.name}
          currentPrice={etf.currentPrice}
          previousClose={etf.previousClose}
          onClick={() => setSelectedSymbol(etf.symbol)}
        />
      ))}
    </div>
  );
}