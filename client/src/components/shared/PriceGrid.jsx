// Component: PriceGrid
// Purpose: Displays a grid/list of price cards (used for stocks or ETFs).
// Handles loading, error states, fetching, and selection logic.

import { useState, useEffect } from 'react';

export default function PriceGrid({
  // e.g. "/api/stocks?limit=50"
  fetchUrl,
  // a function that returns <StockCard .../> or <EtfCard .../>
  renderCard,
  // a function that returns <StockDetail .../> or <EtfDetail .../>
  renderDetail
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
        
        // For each item, fetch the second-latest close price
        const itemsWithPreviousClose = await Promise.all(
          data.map(async (item) => {
            try {
              // Extract type from fetchUrl
              const type = fetchUrl.includes('etfs') ? 'etfs' : 'stocks';
              const prevRes = await fetch(`/api/${type}/${item.Symbol}/prev-close`);
              const prevData = await prevRes.json();
              
              return {
                ...item,
                previousClose: prevData.previousClose
              };
            } catch (err) {
              console.error(`Error fetching previous close for ${item.Symbol}:`, err);
              return {
                ...item,
                previousClose: item.Close
              };
            }
          })
        );
        
        setItems(itemsWithPreviousClose);
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
