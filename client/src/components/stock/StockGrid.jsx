// Component: StockGrid
// Purpose: Displays a grid/list of stock cards.
// Users can browse popular stocks and select one for details.

import StockCard from './StockCard';
import StockDetail from '../../views/StockDetail';
import PriceGrid from '../shared/PriceGrid';

export default function StockGrid() {
  return (
    <PriceGrid
      fetchUrl="/api/stocks?latest=true&limit=50"

      renderCard={(stock, onClick) => 
        <StockCard
          key={stock.Symbol}
          symbol={stock.Symbol}
          latestPrice={stock.Close}
          previousClose={stock.AdjClose}
          onClick={onClick}
        />
      }

      renderDetail={(symbol, onBack) => 
        <StockDetail symbol={symbol} onBack={onBack} />
      }
    />
  );
}
