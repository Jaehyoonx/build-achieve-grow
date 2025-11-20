// View: CompareEtfs
// Purpose: User selects two ETFs to compare performance side-by-side.
import { useState, useEffect } from 'react';
import CompareChart from '../components/CompareChart';

export default function CompareEtfs() {
  const [etfA, setEtfA] = useState(null);
  const [etfB, setEtfB] = useState(null);

  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (etfA && etfB) {
        setLoading(true);
        setError(null);

        try {
          const resA = await fetch(`/api/etfs/${etfA}`);
          if (!resA.ok) throw new Error(`Failed to fetch ${etfA}`);
          const jsonA = await resA.json();

          const resB = await fetch(`/api/etfs/${etfB}`);
          if (!resB.ok) throw new Error(`Failed to fetch ${etfB}`);
          const jsonB = await resB.json();

          setDataA(jsonA);
          setDataB(jsonB);
        } catch (error) {
          console.error('Error fetching ETF data:', error);
          setError(error.message || 'Failed to load comparison data');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [etfA, etfB]);

  if (loading) {
    return <p>Loading comparison data...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Compare ETFs</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <div>
          <label>
            ETF A:
            <input
              type="text"
              value={etfA || ''}
              onChange={e => setEtfA(e.target.value.toUpperCase())}
              placeholder="Enter ETF symbol (e.g., VOO)"
            />
          </label>
        </div>
        <div>
          <label>
            ETF B:
            <input
              type="text"
              value={etfB || ''}
              onChange={e => setEtfB(e.target.value.toUpperCase())}
              placeholder="Enter ETF symbol (e.g., VTI)"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Compare ETFs</h2>

      {/* Input fields for ETF sources */}
      <div>
        <label>
          ETF A:
          <input 
            type="text" 
            value={etfA || ''} 
            onChange={e => setEtfA(e.target.value.toLowerCase())} 
            placeholder="Enter ETF source (e.g., yahoo)" 
          />
        </label>
      </div>
      <div>
        <label>
          ETF B:
          <input 
            type="text" 
            value={etfB || ''} 
            onChange={e => setEtfB(e.target.value.toLowerCase())} 
            placeholder="Enter ETF source (e.g., nasdaq)" 
          />
        </label>
      </div>

      {dataA.length > 0 && dataB.length > 0 ? 
        <CompareChart
          dataA={dataA}
          dataB={dataB}
          symbolA={etfA}
          symbolB={etfB}
        />
        : 
        <p>No data available for selected ETFs.</p>
      }
    </div>
  );
}
