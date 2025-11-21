// Component: PriceChart
// Purpose: Displays a responsive and scalable price history line chart using Recharts.
// Allows users to zoom and filter data by selecting a date range.
// Source: Recharts Documentation - https://recharts.github.io/en-US/api/LineChart/

import { useState, useEffect } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import CompareChart from '../charts/CompareChart';
import './PriceChart.css';

export default function PriceChart({ data, symbol, type }) {
  // State for date range filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rangeError, setRangeError] = useState('');
  
  // State for comparison stock
  const [compareSymbol, setCompareSymbol] = useState('');
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState('');
  
  // State for available stocks list
  const [availableStocks, setAvailableStocks] = useState([]);

  /*
    Determine if this is ETF or Stock context.
    Uses the 'type' prop passed from parent component (etfs or stocks).
  */
  const isEtf = type === 'etfs';
  const assetType = isEtf ? 'ETF' : 'stock';

  // Fetch available stocks for dropdown - runs once
  useEffect(() => {
    const fetchAvailableStocks = async () => {
      try {
        // Determine type based on current context (stocks or etfs)
        const response = await fetch(`/api/${assetType.toLowerCase()}s?latest=true`);
        if (response.ok) {
          const stocks = await response.json();
          const stockSymbols = stocks
            .map(s => s.Symbol || s.symbol)
            .filter(s => s !== symbol)
            .sort();
          setAvailableStocks(stockSymbols);
        }
      } catch (err) {
        console.error('Failed to fetch available stocks:', err);
      }
    };

    fetchAvailableStocks();
  }, [symbol, assetType]);

  /*
    'data' is expected to be an array like:
      [
        { date: '2023-01-01', price: 180 },
        { date: '2023-01-02', price: 185 },
        ...
      ]
  */

  // Custom tooltip component to show date and price together
  // Source: Recharts Tooltip documentation
  // https://recharts.github.io/en-US/api/Tooltip/
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{data.date}</p>
          <p className="tooltip-price">${data.price.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Early return for empty data
  if (!data || data.length === 0) {
    return <p>No chart data available.</p>;
  }

  // Calculate date range from data
  const minDate = data[0]?.date || '';
  const maxDate = data[data.length - 1]?.date || '';

  // Filter data based on selected date range
  const filteredData = startDate && endDate
    ? data.filter(d => d.date >= startDate && d.date <= endDate)
    : data;

  // Display data (filtered or all)
  const displayData = filteredData.length > 0 ? filteredData : data;

  // Calculate responsive chart height based on viewport
  const getChartHeight = () => {
    if (window.innerWidth < 640) {
      return 300;
    }
    if (window.innerWidth < 1024) {
      return 350;
    }
    return 400;
  };

  // Calculate responsive font size based on viewport
  const getResponsiveFontSize = () => {
    if (window.innerWidth < 640) {
      return 10;
    }
    if (window.innerWidth < 1024) {
      return 11;
    }
    return 12;
  };

  // Calculate responsive chart margins
  const getChartMargin = () => {
    const width = window.innerWidth;
    if (width < 640) {
      return { top: 5, right: 20, left: 0, bottom: 40 };
    }
    if (width < 1024) {
      return { top: 5, right: 25, left: 0, bottom: 20 };
    }
    return { top: 5, right: 30, left: 0, bottom: 5 };
  };

  // Get X-axis label angle based on screen size
  const getXAxisAngle = () => {
    if (window.innerWidth < 640) {
      return -90;
    }
    return -45;
  };

  // Get X-axis text anchor based on screen size
  const getXAxisTextAnchor = () => {
    if (window.innerWidth < 640) {
      return 'middle';
    }
    return 'end';
  };

  // Get X-axis label height based on screen size
  const getXAxisHeight = () => {
    if (window.innerWidth < 640) {
      return 100;
    }
    return 80;
  };

  // Get Y-axis width based on screen size
  const getYAxisWidth = () => {
    if (window.innerWidth < 640) {
      return 40;
    }
    return 60;
  };

  const chartHeight = getChartHeight();
  const fontSize = getResponsiveFontSize();
  const chartMargin = getChartMargin();
  const xAxisAngle = getXAxisAngle();
  const xAxisTextAnchor = getXAxisTextAnchor();
  const xAxisHeight = getXAxisHeight();
  const yAxisWidth = getYAxisWidth();

  const handleEndDateClick = () => {
    if (!startDate) {
      setRangeError('Please select a Start Date first.');
    }
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setRangeError('');
  };

  const handleCompareSymbolChange = async (event) => {
    const selectedSymbol = event.target.value;
    setCompareSymbol(selectedSymbol);
    setCompareError('');
    
    if (!selectedSymbol) {
      setCompareData(null);
      return;
    }
    
    try {
      setCompareLoading(true);
      const apiType = assetType.toLowerCase();
      const response = await fetch(
        `/api/${apiType}s/${selectedSymbol.toUpperCase()}`
      );
      if (!response.ok){
        throw new Error(`${selectedSymbol} not found`);
      }
      
      const data = await response.json();
      setCompareData(data);
    } catch (err) {
      setCompareError(`Error loading ${selectedSymbol}: ${err.message}`);
      setCompareData(null);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="price-chart-container">

      {/* Display which chart this is for */}
      <h3 className="price-chart-title">{symbol} Price History</h3>
      <p className="price-chart-description">
        View price trends over time. Select dates below to zoom in on specific periods.
      </p>

      {/* Comparison stock selector */}
      <div className="comparison-selector">
        <label htmlFor="compareInput" className="comparison-label">
          Compare with another {assetType}:
        </label>
        <select
          id="compareInput"
          value={compareSymbol}
          onChange={handleCompareSymbolChange}
          className="comparison-select"
        >
          <option value="">-- Select a {assetType} --</option>
          {availableStocks.map(stock =>
            <option key={stock} value={stock}>
              {stock}
            </option>
          )}
        </select>
        <button
          onClick={() => {
            setCompareSymbol('');
            setCompareData(null);
            setCompareError('');
          }}
          className="comparison-reset-button"
          title="Clear comparison and return to single stock view"
        >
          Reset
        </button>
        {compareLoading && <span className="comparison-status">Loading...</span>}
        {compareError && <span className="comparison-error">{compareError}</span>}
        {compareData && !compareLoading && 
          <span className="comparison-success">Ready</span>}
      </div>

      {/* Date range selector - allows user to zoom into specific date range */}
      <div className="date-range-selector">
        <div className="date-input-group">
          <label htmlFor="startDate" className="date-label">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="date-input"
            title="Choose the starting date for your price chart"
          />
        </div>

        <div className="date-input-group">
          <label 
            htmlFor="endDate" 
            className="date-label"
            style={{
              opacity: !startDate ? 0.5 : 1,
              cursor: !startDate ? 'not-allowed' : 'pointer'
            }}
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onClick={handleEndDateClick}
            onChange={(e) => {
              if (!startDate) return;
              setEndDate(e.target.value);
            }}
            min={startDate || minDate}
            max={maxDate}
            className="date-input"
            style={{
              opacity: startDate ? 1 : 0.5,
              pointerEvents: startDate ? 'auto' : 'none'
            }}
            title={!startDate ? 'Select a Start Date first' : 'Choose your end date'}
          />
        </div>

        <button
          onClick={() => {
            setStartDate('');
            setEndDate('');
          }}
          className="reset-button"
          title="Click to see the full price history"
        >
          Reset
        </button>
      </div>

      {rangeError &&
        <p className="error-text" style={{ color: 'red', marginTop: '4px' }}>
          {rangeError}
        </p>
      }

      <div className="chart-info">
        <span className="data-counter">
          Showing <strong>{displayData.length}</strong> of <strong>{data.length}</strong> days
        </span>
      </div>

      {/*
        ResponsiveContainer: Automatically adjusts chart size based on parent
        Source: Recharts ResponsiveContainer documentation
        https://recharts.github.io/en-US/examples/AreaResponsiveContainer/
        
        Scaling Features:
        - Width: 100% of parent container for full responsiveness
        - Height: Dynamically calculated based on viewport (300-400px)
        - Font sizes: Scale down on mobile devices for readability
        - Margins: Adjusted spacing for proper label display
        - Works on mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
        - Date range filtering: User can zoom into specific date ranges
      */}
      
      {/* Show CompareChart if comparison data is loaded, otherwise show single chart */}
      {compareData ?
        <CompareChart
          dataA={displayData}
          dataB={compareData.map(d => ({ date: d.Date, price: d.Close }))}
          symbolA={symbol}
          symbolB={compareSymbol}
        />
        :
        <div
          className="chart-wrapper"
          style={{ height: chartHeight }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={chartMargin}
            >
              {/* Grid for visual reference */}
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              
              {/* X-axis displays dates - responsive angle based on screen size */}
              <XAxis
                dataKey="date"
                tick={{ fontSize }}
                interval={Math.floor(displayData.length / 6) || 0}
                angle={xAxisAngle}
                textAnchor={xAxisTextAnchor}
                height={xAxisHeight}
              />
              
              {/* Y-axis displays price values */}
              <YAxis
                tick={{ fontSize }}
                type="number"
                width={yAxisWidth}
              />
              
              {/* Tooltip shows date and price values on hover */}
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0'
                }}
              />
              
              {/* Line chart showing price trends */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    </div>
  );
}
