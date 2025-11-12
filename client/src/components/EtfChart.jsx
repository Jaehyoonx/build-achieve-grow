// Component: EtfChart
// Purpose: Placeholder for ETF price history chart.
// Will visualize historical ETF price data.
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function EtfChart({ data, symbol }) {
  /*
    'data' is expected to be an array like:
      [
        { date: '2023-01-01', price: 412.35 },
        { date: '2023-01-02', price: 415.60 },
        ...
      ]

    Depending on your dataset, the price field could be named 'Close' or 'price'.
    We'll handle both to ensure flexibility with Kaggle data.
  */

  if (!data || data.length === 0) {
    return <p>No ETF chart data available.</p>;
  }

  // Normalize field names if Kaggle’s 'Date'/'Close' format is used
  const formattedData = data.map(item => ({
    date: item.date || item.Date,
    price: parseFloat(item.price ?? item.Close)
  }));

  return (
    <div>
      {/* Display which ETF this chart is for */}
      <h3>{symbol} Price History</h3>

      {/* 
        TODO: Figure out resizing and responsiveness for different screen sizes.
        Will need to research Recharts documentation for best practices.
        For now, we keep it fixed size (same as StockChart).
        Reference: Recharts | A composable charting library built on React components
        https://recharts.github.io/?p=/en-US/
      */}
      <LineChart
        style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }}
        data={formattedData}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="price" width="auto" />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
