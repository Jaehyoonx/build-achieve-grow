// View: StockDetail
// Purpose: Shows detailed stock information, chart, filters, and related news.

import { useEffect, useState } from 'react';
import StockCard from '../components/StockCard';
import StockChart from '../components/StockChart';

export default function StockDetail({ symbol, onBack }) {

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      /*
        We make two requests because:
        1) /api/stocks/:symbol returns the *full historical dataset*.
          This is needed to draw the StockChart.
        2) /api/stocks/:symbol/latest returns only the *most recent* entry.
          This is used to show the current price in StockCard.
        
        Fetching latest separately avoids needing to manually sort/filter the history
        and ensures the UI always shows correct and up-to-date price info.
      */
      const histRes = await fetch(`/api/stocks/${symbol}`);
      const histData = await histRes.json();

      const latestRes = await fetch(`/api/stocks/${symbol}/latest`);
      const latestData = await latestRes.json();

      setHistory(histData);
      setLatest(latestData);
      setLoading(false);
    }

    fetchData();
  }, [symbol]);

  if (loading) return <p>Loading stock data...</p>;

  let previousPrice;

  if (history.length > 1) {
    // IF we have at least 2 days of data, use yesterday’s close
    previousPrice = history[1].Close;
  } else {
    // In case only one data point available → fall back to latest price
    previousPrice = latest.Close;
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      {latest && 
        <StockCard
          symbol={latest.Symbol}
          currentPrice={latest.Close}
          previousClose={previousPrice}
        />
      }

      <div>
        <StockChart data={history.map(h => ({ date: h.Date, price: h.Close }))} />
      </div>
    </div>
  );
}
