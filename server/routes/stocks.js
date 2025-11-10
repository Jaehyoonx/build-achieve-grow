import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

//----------Stock Endpoints-----------------------

//Ryan I left this for you good luck!!!!!

/*
  GET /api/stocks
  Returns all stock data
  This is the only fully implemented endpoint so far.
  For now, we’re just doing a simple find({}) with no filters, 
  but in later phases we can add query parameters for pagination or symbol filtering.
*/
router.get('/stocks', async  (req, res) =>{
  try {
    await db.setCollection('stocks');

    // This will go in the collection and find everything (no filter for now)
    // and turn it into an array and store it in stocks
    const limit = parseInt(req.query.limit) || 0;
    const stocks = await db.collection.find({}).limit(limit).toArray();

    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    // Throw 500 for other errors, usually internal server issues
    res.status(500).json({error: 'Failed to fetch stocks'});
  }
});

//-------------Specific Stock Endpoints (Stubbed)-------------

/*
  GET /api/stocks/:symbol
  Returns stock data for a specific symbol (case-insensitive)
  Example: /api/stocks/AAPL
*/
router.get('/stocks/:symbol', async  (req, res) =>{
  try {
    await db.setCollection('stocks');
    const symbol = req.params.symbol.toUpperCase();

    const stockDataForSymbol = await db.collection.find({ symbol: symbol }).toArray();

    if (stockDataForSymbol.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'Symbol not found' });
    }

    res.json(stockDataForSymbol);
  } catch (error) {
    console.error('Error fetching stock:', error);
    // Throw 500 for other errors, usually internal server issues
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

/*
  GET /api/stocks/:symbol/latest
  Returns the latest stock data for a specific symbol (case-insensitive)
  Example: /api/stocks/AAPL/latest
*/
router.get('/stocks/:symbol/latest', async  (req, res) =>{
  try {
    await db.setCollection('stocks');
    const symbol = req.params.symbol.toUpperCase();

    /*
      Find the latest entry by sorting by date descending and limiting to 1
      -1 indicates descending order
      Source: 
      https://stackoverflow.com/questions/13847766/how-to-sort-a-collection-by-date-in-mongodb
    */

    const latest = await db.collection.find({ symbol }).sort({ date: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'Symbol not found' });
    }

    res.json(latest[0]);
  } catch (error) {
    console.error('Error fetching latest:', error);
    // Throw 500 for other errors, usually internal server issues
    res.status(500).json({ error: 'Failed to fetch latest stock data' });
  }
}); 

/*
  GET /api/stocks/search?start=YYYY-MM-DD&end=YYYY-MM-DD
  Returns stock data within a specific date range
  Example: /api/stocks/search?start=2023-01-01&end=2023-01-31
*/
router.get('/stocks/search', async  (req, res) =>{
  try {
    await db.setCollection('stocks');

    const { start, end } = req.query;

    if (!start || !end) {
      // Throw 400 if start or end query parameters are missing (Bad Request)
      return res.status(400).json({ error: 'start and end query parameters are required' });
    }

    /*
      Find all stock entries where date is between start and end (inclusive)
      Using $gte (greater than or equal) and $lte (less than or equal) operators.
      Source: https://stackoverflow.com/questions/2943222/find-objects-between-two-dates-mongodb
    */
    const searchedData = await db.collection.find({
      date: { $gte: start, $lte: end }
    }).toArray();

    res.json(searchedData);
  } catch (error) {
    console.error('Error fetching stock data in date range:', error);
    // Throw 500 for other errors, usually internal server issues
    res.status(500).json({ error: 'Failed to fetch stock data in date range' });
  }
});

//-------------end of Stock section-------------

export default router;