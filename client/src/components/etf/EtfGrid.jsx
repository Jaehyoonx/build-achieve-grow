// Component: EtfGrid
// Purpose: Displays a grid/list of ETF cards.
// Users can browse popular ETFs and select one for details.

import EtfCard from './EtfCard';
import EtfDetail from '../../views/EtfDetail';
import PriceGrid from '../shared/PriceGrid';

export default function EtfGrid() {
  return (
    <PriceGrid
      fetchUrl="/api/etfs?latest=true&limit=50"

      renderCard={(etf, onClick) => 
        <EtfCard
          key={etf.Symbol}
          symbol={etf.Symbol}
          latestPrice={etf.Close}
          previousClose={etf.previousClose}
          onClick={onClick}
        />
      }

      renderDetail={(symbol, onBack) => 
        <EtfDetail symbol={symbol} onBack={onBack} />
      }
    />
  );
}
