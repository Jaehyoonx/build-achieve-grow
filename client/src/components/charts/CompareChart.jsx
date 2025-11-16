// Component: CompareChart
// Purpose: Placeholder for a chart that compares two selected stocks or ETFs.
// Will render a multi-line visualization (e.g., Plotly).
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function CompareChart({ dataA, dataB, symbolA, symbolB }) {

  /*
      Prepare a combined dataset.
      We assume dataA and dataB both contain price data for similar dates.

      Each item in mergedData looks like:
        {
          date: '2023-01-01',
          priceA: 120,
          priceB: 125
        }
    */

  const mergedData = [];

  for (let i = 0; i < dataA.length; i++) {
    const point = dataA[i];
    let priceB;

    // Check if dataB has an entry at this index.
    // If yes, use its price, otherwise set to null.
    if (dataB[i]) {
      priceB = dataB[i].price;
    } else {
      priceB = null;
    }

    mergedData.push({
      date: point.date,
      priceA: point.price,
      priceB: priceB
    });
  }


  return (
    <div>
      {/* Display which stocks or etfs this chart is for */}
      <h3>Comparing {symbolA} vs {symbolB}</h3>

      {/* 
        TODO: Figure out resizing and responsiveness for different screen sizes.
        Will need to research Recharts documentation for best practices in order
        to implement this properly. For now, we keep it fixed size.
        Reference: Recharts | A composable charting library built on React components
        https://recharts.github.io/?p=/en-US/
      */}
      <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} 
        data={mergedData}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="price" />
        <Tooltip />
        <Line type="monotone" dataKey="priceA" stroke="#ff7300" name={symbolA} />
        <Line type="monotone" dataKey="priceB" stroke="#387908" name={symbolB} />
      </LineChart>
    </div>
  );
}
