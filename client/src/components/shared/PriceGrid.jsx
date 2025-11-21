// Component: PriceGrid
// Purpose: Displays a grid/list of price cards (used for stocks or ETFs).
// Handles loading, error states, fetching, and selection logic.

import { useState, useEffect } from 'react';
import './PriceGrid.css';

export default function PriceGrid({
  // e.g. "/api/stocks?latest=true"
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
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const urlWithLimit = `${fetchUrl}&limit=${limit}`;
        const response = await fetch(urlWithLimit);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // For each item, fetch the second-latest close price
        const itemsWithPreviousClose = await Promise.all(
          data.map(async (item) => {
            try {
              // Extract type from fetchUrl
              const type = fetchUrl.includes('etfs') ? 'etfs' : 'stocks';
              const prevRes = await fetch(`/api/${type}/${item.Symbol}/prev-close`);
              if (!prevRes.ok) throw new Error('Failed to fetch previous close');
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
  }, [limit, fetchUrl]);

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 10);
  };

  if (loading && items.length === 0) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="price-grid">
      {/* Left Panel: Grid of Cards */}
      <div className="price-grid-left">
        {items.map(item =>
          renderCard(item, () => setSelectedSymbol(item.Symbol))
        )}
        <button className="load-more-btn" onClick={handleLoadMore}>
          Click to view more
        </button>
      </div>

      {/* Right Panel: Detail View */}
      <div className="price-grid-right">
        {selectedSymbol ?
          renderDetail(selectedSymbol, () => setSelectedSymbol(null))
          :
          <div className="price-grid-empty">
            <p>Select a {fetchUrl.includes('etfs') ? 'ETF' : 'stock'} to view details</p>
          </div>
        }
      </div>
    </div>
  );
}
