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
 *     summary: Get all stock data
 *     description: Retrieve all stock documents from the database, with optional limit.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of stock documents returned.
 *     responses:
 *       200:
 *         description: Successfully retrieved all stocks
 *       500:
 *         description: Failed to fetch stocks
 */
router.get('/stocks', async  (req, res) =>{
  try {
    await db.setCollection('stocks');
    const limit = parseInt(req.query.limit) || 0;
    const stocks = await db.collection.find({}).limit(limit).toArray();

    res.json(stocks.map(transformPriceData));
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
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

    const stockDataForSymbol = await db.collection.find({ fileName: symbol }).toArray();

    if (stockDataForSymbol.length === 0) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

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

    res.json(transformPriceData(latest[0]));
  } catch (error) {
    console.error('Error fetching latest:', error);
    res.status(500).json({ error: 'Failed to fetch latest stock data' });
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

    const searchedData = await db.collection.find({
      date: { $gte: start, $lte: end }
    }).toArray();

    res.json(searchedData.map(transformPriceData));
  } catch (error) {
    console.error('Error fetching stock data in date range:', error);
    res.status(500).json({ error: 'Failed to fetch stock data in date range' });
  }
});

//-------------end of Stock section-------------

export default router;
