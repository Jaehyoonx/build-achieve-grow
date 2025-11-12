// Component: StockChart
// Purpose: Placeholder for stock price history chart.
// Will visualize stock price movements over time (e.g., Recharts).
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function StockChart({ data, symbol }) {
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
  
  return (
    <div>

      {/* Display which stock this chart is for */}
      <h3>{symbol} Price History</h3>

      {/* 
        TODO: Figure out resizing and responsiveness for different screen sizes.
        Will need to research Recharts documentation for best practices in order
        to implement this properly. For now, we keep it fixed size.
        Reference: Recharts | A composable charting library built on React components
        https://recharts.github.io/?p=/en-US/
      */}
      <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} 
        data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="price" width="auto" />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
