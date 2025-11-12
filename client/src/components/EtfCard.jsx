// Component: EtfCard
// Purpose: Represents a single ETF item in a grid/list.
// Will display ETF ticker, price, and basic movement indicator (green/red).
import { useState, useEffect } from 'react';

export default function EtfCard({ symbol, etfName, currentPrice, previousClose, onClick }) {
  const [priceChangeText, setPriceChangeText] = useState('');
  const [percentText, setPercentText] = useState('');
  const [color, setColor] = useState('black');

  useEffect(() => {
    if (previousClose === 0 || previousClose === undefined) return;

    const change = currentPrice - previousClose;
    const percent = (change / previousClose) * 100;

    let changeText;
    let percentFormatted;

    if (change >= 0) {
      // Price increase — show "+" sign and green color
      changeText = '+' + change.toFixed(2);
      percentFormatted = '+' + percent.toFixed(2) + '%';
      setColor('green');
    } else {
      // Price decrease — red color
      changeText = change.toFixed(2);
      percentFormatted = percent.toFixed(2) + '%';
      setColor('red');
    }

    setPriceChangeText(changeText);
    setPercentText(percentFormatted);
  }, [currentPrice, previousClose]);

  function handleSelect() {
    if (onClick) {
      onClick(symbol);
    }
  }

  return (
    <div className="etf-card" onClick={handleSelect}>
      <h3>{symbol}</h3>
      <p>{etfName}</p>

      <p>Current Price: ${currentPrice?.toFixed(2) ?? 'N/A'}</p>

      {previousClose !== undefined && (
        <p>
          Change:{' '}
          <span style={{ color }}>
            {priceChangeText} ({percentText})
          </span>
        </p>
      )}

      <small>Previous Close: ${previousClose?.toFixed(2) ?? 'N/A'}</small>
    </div>
  );
}
