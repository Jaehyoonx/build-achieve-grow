// View: PriceDetail
// Purpose: Shows detailed price information, chart, filters, and related news.
// Shared version used for both stocks and ETFs.

import { useEffect, useState } from 'react';

import PriceCard from '../../components/shared/PriceCard';
import PriceChart from '../../components/shared/PriceChart';

export default function PriceDetail({ type, symbol, onBack }) {

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      /*
        We make two requests because:
        1) /api/{type}/{symbol} returns the *full historical dataset*.
        2) /api/{type}/{symbol}/latest returns only the most recent entry.

        Fetching latest separately avoids needing to manually sort/filter the history
        and ensures the UI always shows correct and up-to-date price info.
      */
      const histRes = await fetch(`/api/${type}/${symbol}`);
      const histData = await histRes.json();

      const latestRes = await fetch(`/api/${type}/${symbol}/latest`);
      const latestData = await latestRes.json();

      setHistory(histData);
      setLatest(latestData);
      setLoading(false);
    }

    fetchData();
  }, [symbol, type]);

  if (loading) return <p>Loading data...</p>;

  let previousPrice;

  if (history.length > 1) {
    previousPrice = history[history.length - 2].Close;
  } else {
    previousPrice = latest.Close;
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      {latest &&
        <PriceCard
          symbol={latest.Symbol}
          currentPrice={latest.Close}
          previousClose={previousPrice}
        />
      }

      <div>
        <PriceChart
          data={history.map(h => ({ date: h.Date, price: h.Close }))}
          symbol={symbol}
        />
      </div>
    </div>
  );
}
