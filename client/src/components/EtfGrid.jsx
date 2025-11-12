// Component: EtfGrid
// Purpose: Displays a grid/list of ETF cards.
// Users can browse popular ETFs and select one for more details.
import { useState, useEffect } from 'react';
import EtfCard from './EtfCard';
import EtfDetail from '../views/EtfDetail';

export default function EtfGrid() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEtfs() {
      try {
        setLoading(true);
        const response = await fetch('/api/etfs?limit=50');
        const data = await response.json();
        setEtfs(data);
      } catch (err) {
        console.error('Error fetching ETFs:', err);
        setError('Failed to load ETFs');
      } finally {
        setLoading(false);
      }
    }

    fetchEtfs();
  }, []);

  if (loading) {
    return <p>Loading ETF data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

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
      {etfs.map(etf =>
        <EtfCard
          key={etf.Symbol}
          symbol={etf.Symbol}
          etfName={etf.Name}
          currentPrice={etf.Close}
          previousClose={etf.AdjClose}
          onClick={() => setSelectedSymbol(etf.Symbol)}
        />
      )}
    </div>
  );
}