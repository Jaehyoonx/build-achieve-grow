import './App.css';
// import NewsPage from './views/NewsPage';
import StockGrid from "./components/stock/StockGrid";
import EtfGrid from "./components/etf/EtfGrid";
function App() {
  return (
    <div>
      <h1>B.A.G. Client</h1>
      
      <EtfGrid />
    </div>
  );
}

export default App;