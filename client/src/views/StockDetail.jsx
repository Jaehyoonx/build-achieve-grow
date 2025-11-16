// View: StockDetail
// Purpose: Shows detailed stock information, chart, filters, and related news.

import PriceDetail from './shared/PriceDetail';

export default function StockDetail(props) {
  return <PriceDetail type="stocks" {...props} />;
}