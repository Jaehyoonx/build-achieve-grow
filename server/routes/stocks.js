import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();
import { transformPriceData } from '../utils/transformPriceData.js';
//----------Stock Endpoints-----------------------

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get all stock data or the latest entry for each symbol
 *     description: >
 *       Retrieve all stock documents from the database.
 *       Use `?latest=true` to get only the most recent entry for each symbol.
 *       Use `?limit=` to limit the number of documents returned.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of stock documents returned.
 *       - in: query
 *         name: latest
 *         schema:
 *           type: boolean
 *           example: true
 *         description: If true, return only the latest record for each stock symbol.
 *     responses:
 *       200:
 *         description: Successfully retrieved stocks
 *       500:
 *         description: Failed to fetch stocks
 */
router.get('/stocks', async (req, res) => {
  try {
    await db.setCollection('stocks');
    const limit = parseInt(req.query.limit) || 0;
    const latest = req.query.latest === 'true';

    if (latest) {
      // Only the most recent record per symbol
      const allStocks = await db.collection.find({}).sort({ Date: -1 }).limit(limit).toArray();

      const latestStocksMap = new Map();

      for (const stock of allStocks) {
        const symbol = stock.fileName;
        if (symbol && !latestStocksMap.has(symbol)) {
          latestStocksMap.set(symbol, stock);
        }
      }

      const latestStocks = Array.from(latestStocksMap.values()).
      
        /* 
          Sort alphabetically by fileName.
          localeCompare used for string comparison
          Source: https://stackoverflow.com/questions/6712034/sort-array-by-firstname-
          alphabetically-in-javascript
        */
        sort((a, b) => a.fileName.localeCompare(b.fileName));

      // Cache Control improvement for 1 hour
      res.set('Cache-Control', 'public, max-age=3600');

      res.json(latestStocks.map(transformPriceData));
    } else {
      // Regular fetch: return all or limited records
      const stocks = await db.collection.find({}).limit(limit).toArray();

      // Cache Control improvement for 1 hour
      res.set('Cache-Control', 'public, max-age=3600');

      res.json(stocks.map(transformPriceData));
    }
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

/**
 * @swagger
 * /api/stocks/search:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Search stocks by date range
 *     description: Retrieve stock data between specific start and end dates.
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           example: "2023-01-01"
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           example: "2023-01-31"
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data in date range
 *       400:
 *         description: Missing start or end query parameters
 *       500:
 *         description: Failed to fetch stock data in date range
 */
router.get('/stocks/search', async (req, res) => {
  try {
    await db.setCollection('stocks');

    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'start and end query parameters are required' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return res.status(400).json({ error: 'Date format must be YYYY-MM-DD' });
    }

    // Validate date range logic
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date provided' });
    }
    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const searchedData = await db.collection.find({
      date: { $gte: start, $lte: end }
    }).toArray();

    // Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');

    res.json(searchedData.map(transformPriceData));
  } catch (error) {
    console.error('Error fetching stock data in date range:', error);
    res.status(500).json({ error: 'Failed to fetch stock data in date range' });
  }
});

/**
 * @swagger
 * /api/stocks/{symbol}:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get stock data by symbol
 *     description: Retrieve all stock records for a specific symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: AAPL
 *       - in: query
 *         name: sortDesc
 *         schema:
 *           type: boolean
 *           example: true
 *         description: If true, sort the stock data by date descending.
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data for symbol
 *       404:
 *         description: Symbol not found
 *       500:
 *         description: Failed to fetch stock data
 */
router.get('/stocks/:symbol', async (req, res) => {
  try {
    await db.setCollection('stocks');
    const symbol = req.params.symbol.toUpperCase();

    // Validate symbol format
    // Check if symbol contains only alphanumeric characters and is not longer than 5 characters
    if (!/^[A-Z0-9]+$/.test(symbol) || symbol.length > 5) {
      return res.status(400).json({ error: 'Invalid symbol format' });
    }

    // Always sort by date ascending (oldest first)
    const stockDataForSymbol = await db.collection.find({ fileName: symbol }).sort(
      { Date: 1 }
    ).toArray();

    if (stockDataForSymbol.length === 0) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    // Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');

    res.json(stockDataForSymbol.map(transformPriceData));
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

/**
 * @swagger
 * /api/stocks/{symbol}/latest:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get the latest stock data for a symbol
 *     description: Retrieve the most recent stock entry (by date) for a given symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest stock data
 *       404:
 *         description: Symbol not found
 *       500:
 *         description: Failed to fetch latest stock data
 */
router.get('/stocks/:symbol/latest', async (req, res) => {
  try {
    await db.setCollection('stocks');
    const symbol = req.params.symbol.toUpperCase();

    // Validate symbol format
    if (!/^[A-Z0-9]+$/.test(symbol) || symbol.length > 5) {
      return res.status(400).json({ error: 'Invalid symbol format' });
    }
    /*
      Find the latest entry by sorting by date descending and limiting to 1
      -1 indicates descending order
      Source: 
      https://stackoverflow.com/questions/13847766/how-to-sort-a-collection-by-date-in-mongodb
    */

    const latest = await db.collection.find({ fileName: symbol }
    ).sort({ Date: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    // Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');

    res.json(transformPriceData(latest[0]));
  } catch (error) {
    console.error('Error fetching latest:', error);
    res.status(500).json({ error: 'Failed to fetch latest stock data' });
  }
});

/**
 * @swagger
 * /api/stocks/{symbol}/prev-close:
 *   get:
 *     tags:
 *       - Stocks
 *     summary: Get the second-latest close price for a stock symbol
 *     description: Returns the Close price from the second-most recent trading day.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock symbol
 *     responses:
 *       200:
 *         description: Successfully retrieved previous close price
 *       404:
 *         description: Symbol not found
 *       500:
 *         description: Failed to fetch data
 */
router.get('/stocks/:symbol/prev-close', async (req, res) => {
  try {
    await db.setCollection('stocks');
    const symbol = req.params.symbol.toUpperCase();

    // Validate symbol format
    if (!/^[A-Z0-9]+$/.test(symbol) || symbol.length > 5) {
      return res.status(400).json({ error: 'Invalid symbol format' });
    }

    const records = await db.collection.find({ fileName: symbol }).
      sort({ Date: -1 }).
      limit(2).
      toArray();

    if (records.length === 0) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    // If only 1 record exists, return that close price
    if (records.length === 1) {
      // Cache Control improvement for 1 hour
      res.set('Cache-Control', 'public, max-age=3600');

      return res.json({ previousClose: Number(records[0].Close) });
    }

    // Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');

    // Return the second record's close (second-latest)
    res.json({ previousClose: Number(records[1].Close) });
  } catch (error) {
    console.error('Error fetching previous close:', error);
    res.status(500).json({ error: 'Failed to fetch previous close' });
  }
});

//-------------end of Stock section-------------

export default router;
