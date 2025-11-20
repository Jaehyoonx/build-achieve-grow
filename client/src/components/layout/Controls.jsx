import './Controls.css';

export default function Controls({ currentView, onViewChange }) {
  return (
    <div className="controls">
      <button
        className={`control-btn ${currentView === 'stocks' ? 'active' : ''}`}
        onClick={() => onViewChange('stocks')}
      >
        Stocks
      </button>
      <button
        className={`control-btn ${currentView === 'etfs' ? 'active' : ''}`}
        onClick={() => onViewChange('etfs')}
      >
        ETFs
      </button>
      <button
        className={`control-btn ${currentView === 'headlines' ? 'active' : ''}`}
        onClick={() => onViewChange('headlines')}
      >
        Headlines
      </button>
    </div>
  );
}
