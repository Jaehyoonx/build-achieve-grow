// Component: EtfCard
// Purpose: Represents a single ETF in a grid/list.
// Displays ticker, current price, and up/down color indicator.

import PriceCard from "../shared/PriceCard";

export default function EtfCard(props) {
  return <PriceCard {...props} />;
}
