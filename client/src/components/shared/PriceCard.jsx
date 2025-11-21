// Component: PriceCard
// Purpose: Generic price card (used for stocks or ETFs).
// Displays ticker, current price, and up/down color indicator.
// This is exactly the same logic and comments you used in StockCard.
import { useState, useEffect } from 'react';

export default function PriceCard({
  symbol,
  latestPrice,
  latestDate,
  previousClose,
  onClick,
  isSelected
}) {

  const [priceChangeText, setPriceChangeText] = useState('');
  const [percentText, setPercentText] = useState('');
  const [color, setColor] = useState('black');

  useEffect(() => {
    const change = latestPrice - previousClose;
    const percent = change / previousClose * 100;

    // Format the price change and color for display
    let changeText;
    let percentFormatted;

    /*
      The current price minus the previous close tells us if the stock
      has gone up (positive) or down (negative).
    */
    if (change >= 0) {

      /*
        If the change is positive:
          - Add a "+" to the front so it looks like: +2.35
          - Same for the percent: +1.24%
          - Set the text color to **green** to show gain
      */
      changeText = '+' + change.toFixed(2);
      percentFormatted = '+' + percent.toFixed(2) + '%';
      setColor('green');
    } else {

      /*
        If the change is negative:
          - change.toFixed(2) already has the "-" sign,
            so we don't need to manually add one.
          - The percent will also show the minus sign naturally.
          - Set the text color to **red** to show loss
      */
      changeText = change.toFixed(2);
      percentFormatted = percent.toFixed(2) + '%';
      setColor('red');
    }

    setPriceChangeText(changeText);
    setPercentText(percentFormatted);
  }, [latestPrice, previousClose]);

  function handleSelect() {
    if (onClick) {
      onClick(symbol);
    }
  }

  let cardStyle = {};
  if (isSelected) {
    cardStyle = {
      borderColor: '#27ae60',
      borderWidth: '3px',
      boxShadow: '0 0 10px rgba(39, 174, 96, 0.5)'
    };
  } else {
    cardStyle = {};
  }

  return (
    <div className="price-card" onClick={handleSelect} style={cardStyle}>
      <h3>{symbol}</h3>

      <p>Latest Price as of {latestDate}: ${latestPrice.toFixed(2)}</p>

      <p>
        Change: <span style={{ color: color }}>{priceChangeText} ({percentText})</span>
      </p>

      <small>Previous Close: ${previousClose.toFixed(2)}</small>
    </div>
  );
}