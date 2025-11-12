import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

// Helper function to transform stock document fields because MongoDB 
// stores numbers as strings
function transformStock(doc) {
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
//-------------ETFs Section-------------

/**
 * @swagger
 * /api/etfs:
 *   get:
 *     tags:
 *       - ETFs
 *     summary: Get all ETF data
 *     description: Retrieve all ETF documents from the database, with optional limit.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of ETF documents returned.
 *     responses:
 *       200:
 *         description: Successfully retrieved all ETFs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   symbol:
 *                     type: string
 *                     example: "VOO"
 *                   Date:
 *                     type: string
 *                     example: "2024-01-15"
 *                   Open:
 *                     type: number
 *                     example: 450.12
 *                   Close:
 *                     type: number
 *                     example: 452.56
 *                   Volume:
 *                     type: number
 *                     example: 1200000
 *       500:
 *         description: Failed to fetch ETFs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch ETFs"
 */
router.get('/etfs', async (req, res) => {
  try {
    await db.setCollection('etfs');
    // Parse limit from query (defaults to 0 = no limit)
    const limit = parseInt(req.query.limit) || 0;

    // Fetch all ETF documents with optional limit
    const etfs = await db.collection.find({}).limit(limit).toArray();

    res.status(200).json(etfs.map(transformStock));
  } catch (error) {
    console.error('Error fetching ETFs:', error);
    // Throw 500 for internal server issues
    res.status(500).json({ error: 'Failed to fetch ETFs' });
  }
});

/**
 * @swagger
 * /api/etfs/{symbol}:
 *   get:
 *     tags:
 *       - ETFs
 *     summary: Get ETF data by symbol
 *     description: Retrieve all ETF records for a specific symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: VOO
 *         description: The ETF symbol to search for.
 *     responses:
 *       200:
 *         description: Successfully retrieved ETF data for symbol
 *       404:
 *         description: ETF symbol not found
 *       500:
 *         description: Failed to fetch ETF
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

    res.json(etfDataForSymbol.map(transformStock));
  } catch (error) {
    console.error('Error fetching ETF:', error);
    res.status(500).json({ error: 'Failed to fetch ETF data' });
  }
});

/**
 * @swagger
 * /api/etfs/{symbol}/latest:
 *   get:
 *     tags:
 *       - ETFs
 *     summary: Get the latest ETF data for a symbol
 *     description: Retrieve the most recent ETF entry (by Date) for a given symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: VOO
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest ETF data
 *       404:
 *         description: ETF symbol not found
 *       500:
 *         description: Failed to fetch latest ETF data
 */
router.get('/etfs/:symbol/latest', async (req, res) => {
  try {
    await db.setCollection('etfs');
    const symbol = req.params.symbol.toUpperCase();

    const latest = await db.collection.find({ symbol }).sort({ Date: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'ETF symbol not found' });
    }

    res.json(transformStock(latest[0]));
  } catch (error) {
    console.error('Error fetching latest ETF:', error);
    res.status(500).json({ error: 'Failed to fetch latest ETF data' });
  }
});

/**
 * @swagger
 * /api/etfs/search:
 *   get:
 *     tags:
 *       - ETFs
 *     summary: Search ETFs by date range
 *     description: Retrieve ETF data between specific start and end dates.
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
 *         description: Successfully retrieved ETF data within the date range
 *       400:
 *         description: Missing start or end query parameters
 *       500:
 *         description: Failed to fetch ETF data in date range
 */
router.get('/etfs/search', async (req, res) => {
  try {
    await db.setCollection('etfs');

    const { start, end } = req.query;

    if (!start || !end) {
      // Throw 400 if start or end query parameters are missing
      return res.status(400).json({ error: 'start and end query parameters are required' });
    }

    const searchedData = await db.collection.find({
      Date: { $gte: start, $lte: end }
    }).toArray();

    res.json(searchedData.map(transformStock));
  } catch (error) {
    console.error('Error fetching ETF data in date range:', error);
    res.status(500).json({ error: 'Failed to fetch ETF data in date range' });
  }
});

//-------------end of ETFs Section-------------

export default router;
