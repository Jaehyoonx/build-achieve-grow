// View: EtfDetail
// Purpose: Shows detailed ETF information, chart, filters, and related news.

import PriceDetail from "./shared/PriceDetail";

export default function EtfDetail(props) {
  return <PriceDetail type="etfs" {...props} />;
}
