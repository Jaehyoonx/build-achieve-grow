// Component: CompareChart
// Purpose: Display a comparison chart for two selected stocks or ETFs.
// Shows multi-line visualization with responsive styling matching PriceChart.
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './CompareChart.css';

export default function CompareChart({ dataA, dataB, symbolA, symbolB }) {
  // Merge dataA and dataB by date for overlay comparison
  // Creates combined dataset with both prices for each date
  const dataBMap = {};
  for (let i = 0; i < dataB.length; i++) {
    const point = dataB[i];
    dataBMap[point.date] = point.price;
  }

  // Merge dataA with dataB by matching dates
  const mergedData = [];

  for (let i = 0; i < dataA.length; i++) {
    const point = dataA[i];
    const priceB = dataBMap[point.date] || null;

    mergedData.push({
      date: point.date,
      priceA: point.price,
      priceB
    });
  }

  // Calculate responsive height based on viewport width
  // Matches breakpoints in PriceChart for consistency
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

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const tooltipContent = [];
      const data = payload[0].payload;
      
      tooltipContent.push(
        <p key="date" className="tooltip-date">
          {data.date}
        </p>
      );
      
      if (data.priceA !== undefined && data.priceA !== null) {
        tooltipContent.push(
          <p key="priceA" className="tooltip-price">
            {symbolA}: ${data.priceA.toFixed(2)}
          </p>
        );
      }
      
      if (data.priceB !== undefined && data.priceB !== null) {
        tooltipContent.push(
          <p key="priceB" className="tooltip-price">
            {symbolB}: ${data.priceB.toFixed(2)}
          </p>
        );
      }
      
      return <div className="custom-tooltip">{tooltipContent}</div>;
    }
    return null;
  };

  return (
    <div className="price-chart-container">
      <h3 className="price-chart-title">Comparing {symbolA} vs {symbolB}</h3>
      <p className="price-chart-description">
        View price trends and compare performance of {symbolA} and {symbolB} side-by-side
      </p>

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
      <div className="chart-wrapper" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              fontSize={fontSize}
              tick={{ fill: '#666' }}
              angle={xAxisAngle}
              textAnchor={xAxisTextAnchor}
              height={xAxisHeight}
            />
            <YAxis 
              fontSize={fontSize}
              tick={{ fill: '#666' }}
              width={yAxisWidth}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="priceA"
              stroke="#ff7300"
              name={symbolA}
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="priceB"
              stroke="#387908"
              name={symbolB}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
