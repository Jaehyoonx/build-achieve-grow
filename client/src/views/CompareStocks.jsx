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

  useEffect(() => {
    async function fetchData() {
      if (stockA && stockB) {
        setLoading(true);

        const resA = await fetch(`/api/stocks/${stockA}`);
        const jsonA = await resA.json();

        const resB = await fetch(`/api/stocks/${stockB}`);
        const jsonB = await resB.json();
        
        setDataA(jsonA);
        setDataB(jsonB);
        setLoading(false);

      }
    }

    fetchData();
  }, [stockA, stockB]);

  if (loading){
    return <p>Loading comparison data...</p>;
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
