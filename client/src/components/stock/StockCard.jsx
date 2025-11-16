// Component: StockCard
// Purpose: Represents a single stock in a grid/list.
// Displays ticker, current price, and up/down color indicator.
import PriceCard from "../shared/PriceCard";

export default function StockCard(props) {
  return <PriceCard {...props} />;
}