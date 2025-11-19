// Component: PriceChart
// Purpose: Displays a responsive and scalable price history line chart using Recharts.
// Allows users to zoom and filter data by selecting a date range.
// Source: Recharts Documentation - https://recharts.github.io/en-US/api/LineChart/

import { useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import './PriceChart.css';

export default function PriceChart({ data, symbol }) {
  // State for date range filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rangeError, setRangeError] = useState('');

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

  /*
    'data' is expected to be an array like:
      [
        { date: '2023-01-01', price: 180 },
        { date: '2023-01-02', price: 185 },
        ...
      ]
  */

  if (!data || data.length === 0) {
    return <p>No chart data available.</p>;
  }

  // Get min and max dates from data for input constraints

  // Set min and max dates from data for input constraints
  // Set defaults if data is empty
  const minDate = data[0]?.date || '';
  const maxDate = data[data.length - 1]?.date || '';

  // Filter data based on selected date range
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : new Date(minDate);
    const end = endDate ? new Date(endDate) : new Date(maxDate);
    return itemDate >= start && itemDate <= end;
  });

  // Display data uses filtered or full data
  const displayData = filteredData.length > 0 ? filteredData : data;

  // Calculate responsive height based on viewport width
  // Source: CSS Media Query Breakpoints
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries
  const getChartHeight = () => {
    if (typeof window === 'undefined') return 400;
    const width = window.innerWidth;
    
    // Mobile: height 300px
    if (width < 640) return 300;
    // Tablet: height 350px
    if (width < 1024) return 350;
    // Desktop: height 400px
    return 400;
  };

  // Calculate responsive font sizes
  const getResponsiveFontSize = () => {
    if (typeof window === 'undefined') return 12;
    const width = window.innerWidth;
    
    if (width < 640) return 10;
    if (width < 1024) return 11;
    return 12;
  };

  const chartHeight = getChartHeight();
  const fontSize = getResponsiveFontSize();

  const handleEndDateClick = () => {
    if (!startDate) {
      setRangeError('Please select a Start Date first.');
    }
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setRangeError('');
  };

  return (
    <div className="price-chart-container">

      {/* Display which chart this is for */}
      <h3 className="price-chart-title">{symbol} Price History</h3>
      <p className="price-chart-description">
        View price trends over time. Select dates below to zoom in on specific periods.
      </p>

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
      <div
        className="chart-wrapper"
        style={{ height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {/* Grid for visual reference */}
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            
            {/* X-axis displays dates - responsive angle based on screen size */}
            <XAxis
              dataKey="date"
              tick={{ fontSize }}
              interval={Math.floor(displayData.length / 6) || 0}
              angle={window.innerWidth < 640 ? -90 : -45}
              textAnchor={window.innerWidth < 640 ? 'middle' : 'end'}
              height={window.innerWidth < 640 ? 100 : 80}
            />
            
            {/* Y-axis displays price values */}
            <YAxis
              tick={{ fontSize }}
              type="number"
              width={window.innerWidth < 640 ? 40 : 60}
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
    </div>
  );
}
