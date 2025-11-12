import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

//-------------ETFs Section-------------

/*
  GET /api/etfs
  Returns all ETF data.
  Similar to the /api/stocks route — for now, we simply fetch every document
  from the "etfs" collection using find({}) with no filters.
  
  Since our ETF dataset is small, we’re not adding pagination or limits yet.
  Later, if the dataset grows, we can introduce:
    - ?limit= number of ETFs to return
    - ?source= filter by dataset source
    - pagination (skip/limit)
*/
router.get('/etfs', async (req, res) => {
  try {
    await db.setCollection('etfs');

    // Fetch all ETF documents from MongoDB and convert to array
    const etfs = await db.collection.find({}).toArray();

    res.status(200).json(etfs);
  } catch (error) {
    console.error('Error fetching ETFs:', error);
    // Throw 500 for internal server issues
    res.status(500).json({ error: 'Failed to fetch ETFs' });
  }
});

/*
  GET /api/etfs/:symbol
  Returns ETF data for a specific symbol (case-insensitive)
  Example: /api/etfs/VOO
*/
router.get('/etfs/:symbol', async (req, res) => {
  try {
    await db.setCollection('etfs');
    const symbol = req.params.symbol.toUpperCase();

    const etfDataForSymbol = await db.collection.find({ symbol: symbol }).toArray();

    if (etfDataForSymbol.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'ETF symbol not found' });
    }

    res.json(etfDataForSymbol);
  } catch (error) {
    console.error('Error fetching ETF:', error);
    res.status(500).json({ error: 'Failed to fetch ETF data' });
  }
});

/*
  GET /api/etfs/:symbol/latest
  Returns the latest ETF data for a specific symbol (case-insensitive)
  Example: /api/etfs/VOO/latest
*/
router.get('/etfs/:symbol/latest', async (req, res) => {
  try {
    await db.setCollection('etfs');
    const symbol = req.params.symbol.toUpperCase();

    /*
      Find the latest entry by sorting by Date descending and limiting to 1.
      -1 indicates descending order.
      Source:
      https://stackoverflow.com/questions/13847766/how-to-sort-a-collection-by-date-in-mongodb
    */
    const latest = await db.collection.find({ symbol }).sort({ Date: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'ETF symbol not found' });
    }

    res.json(latest[0]);
  } catch (error) {
    console.error('Error fetching latest ETF:', error);
    res.status(500).json({ error: 'Failed to fetch latest ETF data' });
  }
});

/*
  GET /api/etfs/search?start=YYYY-MM-DD&end=YYYY-MM-DD
  Returns ETF data within a specific date range
  Example: /api/etfs/search?start=2023-01-01&end=2023-01-31
*/
router.get('/etfs/search', async (req, res) => {
  try {
    await db.setCollection('etfs');

    const { start, end } = req.query;

    if (!start || !end) {
      // Throw 400 if start or end query parameters are missing
      return res.status(400).json({ error: 'start and end query parameters are required' });
    }

    /*
      TODO: Validate date format (YYYY-MM-DD)
      and ensure start <= end before querying.
    */

    /*
      Find all ETF entries where Date is between start and end (inclusive)
      Using $gte (greater than or equal) and $lte (less than or equal) operators.
      Source: https://stackoverflow.com/questions/2943222/find-objects-between-two-dates-mongodb
    */
    const searchedData = await db.collection.find({
      Date: { $gte: start, $lte: end }
    }).toArray();

    res.json(searchedData);
  } catch (error) {
    console.error('Error fetching ETF data in date range:', error);
    res.status(500).json({ error: 'Failed to fetch ETF data in date range' });
  }
});

//-------------end of ETFs Section-------------

export default router;
