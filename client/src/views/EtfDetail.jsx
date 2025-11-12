// View: EtfDetail
// Purpose: Shows detailed ETF information, chart, and related news.
import { useEffect, useState } from 'react';
import EtfCard from '../components/EtfCard';
import EtfChart from '../components/EtfChart';

export default function EtfDetail({ symbol, onBack }) {

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      /*
        We make two requests because:
        1) /api/etfs/:symbol returns the *full historical dataset*.
           This is needed to draw the EtfChart.
        2) /api/etfs/:symbol/latest returns only the *most recent* entry.
           This is used to show the current price in EtfCard.
        
        Fetching latest separately avoids needing to manually sort/filter the history
        and ensures the UI always shows correct and up-to-date price info.
      */
      const histRes = await fetch(`/api/etfs/${symbol}`);
      const histData = await histRes.json();

      const latestRes = await fetch(`/api/etfs/${symbol}/latest`);
      const latestData = await latestRes.json();

      setHistory(histData);
      setLatest(latestData);
      setLoading(false);
    }

    fetchData();
  }, [symbol]);

  if (loading) return <p>Loading ETF data...</p>;

  let previousPrice;

  if (history.length > 1) {
    // IF we have at least 2 days of data, use yesterday’s close
    previousPrice = history[1].price;
  } else {
    // In case only one data point available → fall back to latest price
    previousPrice = latest.price;
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <h1>{symbol}</h1>

      {latest && 
        <EtfCard
          symbol={latest.symbol}
          currentPrice={latest.price}
          previousClose={previousPrice}
        />
      }

      <div>
        <EtfChart data={history} />
      </div>
    </div>
  );
}
