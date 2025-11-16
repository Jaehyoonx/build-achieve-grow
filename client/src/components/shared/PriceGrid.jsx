// Component: PriceGrid
// Purpose: Displays a grid/list of price cards (used for stocks or ETFs).
// Handles loading, error states, fetching, and selection logic.

import { useState, useEffect } from 'react';

export default function PriceGrid({
  fetchUrl,            // e.g. "/api/stocks?limit=50"
  renderCard,          // a function that returns <StockCard .../> or <EtfCard .../>
  renderDetail         // a function that returns <StockDetail .../> or <EtfDetail .../>
}) {

  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [fetchUrl]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (selectedSymbol) {
    return renderDetail(selectedSymbol, () => setSelectedSymbol(null));
  }

  return (
    <div className="price-grid">
      {items.map(item =>
        renderCard(item, () => setSelectedSymbol(item.Symbol))
      )}
    </div>
  );
}
