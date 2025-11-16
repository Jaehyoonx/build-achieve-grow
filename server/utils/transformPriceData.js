// Transform price data from MongoDB
// Convert strings to numbers and normalize field names.

export function transformPriceData(doc) {
  return {
    Symbol: doc.fileName,
    Date: doc.Date,
    Open: Number(doc.Open),
    High: Number(doc.High),
    Low: Number(doc.Low),
    Close: Number(doc.Close),
    AdjClose: Number(doc['Adj Close']),
    Volume: Number(doc.Volume),
  };
}
