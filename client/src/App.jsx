import './App.css';
import { useState, lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Controls from './components/layout/Controls';
import StockGrid from './components/stock/StockGrid';
import EtfGrid from './components/etf/EtfGrid';
import Footer from './components/layout/Footer';

const NewsPage = lazy(() => import('./views/NewsPage'));
function App() {
  const [currentView, setCurrentView] = useState('stocks');

  const getViewTitle = () => {
    if (currentView === 'stocks') {
      return 'Browse and compare stocks';
    } else if (currentView === 'etfs') {
      return 'Browse and compare ETFs';
    } else if (currentView === 'headlines') {
      return 'Latest financial news and headlines';
    } else {
      return '';
    }
  };

  const renderContent = () => {
    if (currentView === 'stocks') {
      return <StockGrid />;
    } else if (currentView === 'etfs') {
      return <EtfGrid />;
    } else if (currentView === 'headlines') {
      return (
        <Suspense fallback={<div>Loading headlines ..</div>}>
          <NewsPage />
        </Suspense>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="app-container">
      <Header viewTitle={getViewTitle()} />
      <Controls currentView={currentView} onViewChange={setCurrentView} />
      <main className="app-main">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;