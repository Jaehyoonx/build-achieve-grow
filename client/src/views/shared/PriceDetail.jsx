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
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        /*
          We make two requests because:
          1) /api/{type}/{symbol} returns the *full historical dataset*.
          2) /api/{type}/{symbol}/latest returns only the most recent entry.

          Fetching latest separately avoids needing to manually sort/filter the history
          and ensures the UI always shows correct and up-to-date price info.
        */
        const histRes = await fetch(`/api/${type}/${symbol}`);
        if (!histRes.ok) throw new Error(`Failed to fetch history for ${symbol}`);
        const histData = await histRes.json();

        const latestRes = await fetch(`/api/${type}/${symbol}/latest`);
        if (!latestRes.ok) throw new Error(`Failed to fetch latest data for ${symbol}`);
        const latestData = await latestRes.json();

        setHistory(histData);
        setLatest(latestData);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError(err.message || 'Failed to load price data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [symbol, type]);

  if (loading) return <p>Loading data...</p>;

  if (error) {
    return (
      <div>
        <button onClick={onBack}>← Back</button>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  if (!latest || history.length === 0) {
    return (
      <div>
        <button onClick={onBack}>← Back</button>
        <p>No data available for {symbol}</p>
      </div>
    );
  }

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
          latestPrice={latest.Close}
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
