// View: CompareStocks
// Purpose: User selects two stocks to compare performance history.

import { useState, useEffect } from 'react';
import CompareChart from '../components/CompareChart';


export default function CompareStocks() {
  const [stockA, setStockA] = useState(null);
  const [stockB, setStockB] = useState(null);

  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (stockA && stockB) {
        setLoading(true);
        setError(null);

        try {
          const resA = await fetch(`/api/stocks/${stockA}`);
          if (!resA.ok) throw new Error(`Failed to fetch ${stockA}`);
          const jsonA = await resA.json();

          const resB = await fetch(`/api/stocks/${stockB}`);
          if (!resB.ok) throw new Error(`Failed to fetch ${stockB}`);
          const jsonB = await resB.json();
          
          setDataA(jsonA);
          setDataB(jsonB);
        } catch (err) {
          console.error('Error fetching stock data:', err);
          setError(err.message || 'Failed to load comparison data');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [stockA, stockB]);

  if (loading){
    return <p>Loading comparison data...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Compare Stocks</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <div>
          <label>
            Stock A:
            <input 
              type="text" 
              value={stockA || ''} 
              onChange={e => setStockA(e.target.value.toUpperCase())} 
              placeholder="Enter stock symbol (e.g., AAPL)" 
            />
          </label>
        </div>
        <div>
          <label>
            Stock B:
            <input 
              type="text" 
              value={stockB || ''} 
              onChange={e => setStockB(e.target.value.toUpperCase())} 
              placeholder="Enter stock symbol (e.g., MSFT)" 
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Compare Stocks</h2>

      {/* Simple input fields for stock symbols */}
      <div>
        <label>
          Stock A:
          <input 
            type="text" 
            value={stockA || ''} 
            onChange={e => setStockA(e.target.value.toUpperCase())} 
            placeholder="Enter stock symbol (e.g., AAPL)" 
          />
        </label>
      </div>
      <div>
        <label>
          Stock B:
          <input 
            type="text" 
            value={stockB || ''} 
            onChange={e => setStockB(e.target.value.toUpperCase())} 
            placeholder="Enter stock symbol (e.g., MSFT)" 
          />
        </label>
      </div>
      {dataA.length > 0 && dataB.length > 0 ? 
        <CompareChart
          dataA={dataA}
          dataB={dataB}
          symbolA={stockA}
          symbolB={stockB}
        />
        : 
        <p>No data available for selected symbols.</p>
      }
    </div>
  );
}
