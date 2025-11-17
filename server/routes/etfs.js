import express from 'express';
import { db } from '../db/db.js';
import { transformPriceData } from '../utils/transformPriceData.js';
const router = express.Router();

//-------------ETFs Section-------------

/**
 * @swagger
 * /api/etfs:
 *   get:
 *     tags:
 *       - ETFs
 *     summary: Get all ETF data or the latest entry for each symbol
 *     description: >
 *       Retrieve all ETF documents from the database.
 *       Use `?latest=true` to get only the most recent entry for each ETF symbol.
 *       Use `?limit=` to limit the number of documents returned.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of ETF documents returned.
 *       - in: query
 *         name: latest
 *         schema:
 *           type: boolean
 *           example: true
 *         description: If true, return only the latest record for each ETF symbol.
 *     responses:
 *       200:
 *         description: Successfully retrieved ETFs
 *       500:
 *         description: Failed to fetch ETFs
 */
router.get('/etfs', async (req, res) => {
  try {
    await db.setCollection('etfs');
    const limit = parseInt(req.query.limit) || 0;
    const latest = req.query.latest === 'true';

    if (latest) {
      // Only the most recent record per symbol
      const allEtfs = await db.collection.find({}).sort({ Date: -1 }).limit(limit).toArray();

      const latestEtfMap = new Map();

      for (const etf of allEtfs) {
        const symbol = etf.fileName;
        if (symbol && !latestEtfMap.has(symbol)) {
          latestEtfMap.set(symbol, etf);
        }
      }

      const latestEtfs = Array.from(latestEtfMap.values()).
        /*
          Sort alphabetically by fileName.
          Source:https://stackoverflow.com/questions/6712034/sort-array-by-firstname-
          alphabetically-in-javascript
        */
        sort((a, b) => a.fileName.localeCompare(b.fileName));

      return res.json(latestEtfs.map(transformPriceData));
    }

    // Regular fetch
    const etfs = await db.collection.find({}).limit(limit).toArray();
    res.json(etfs.map(transformPriceData));

  } catch (error) {
    console.error('Error fetching ETFs:', error);
    res.status(500).json({ error: 'Failed to fetch ETFs' });
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

    res.json(searchedData.map(transformPriceData));
  } catch (error) {
    console.error('Error fetching ETF data in date range:', error);
    res.status(500).json({ error: 'Failed to fetch ETF data in date range' });
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

    // Always sort by date ascending (oldest first)
    const etfDataForSymbol = await db.collection.find({ fileName: symbol }).sort(
      { Date: 1 }
    ).toArray();

    if (etfDataForSymbol.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'ETF symbol not found' });
    }

    res.json(etfDataForSymbol.map(transformPriceData));
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

    const latestQuery = db.collection.find({ fileName: symbol }).sort({ Date: -1 }).limit(1);
    const latest = await latestQuery.toArray();


    if (latest.length === 0) {
      // Throw 404 if no data found for the symbol
      return res.status(404).json({ error: 'ETF symbol not found' });
    }

    res.json(transformPriceData(latest[0]));
  } catch (error) {
    console.error('Error fetching latest ETF:', error);
    res.status(500).json({ error: 'Failed to fetch latest ETF data' });
  }
});

//-------------end of ETFs Section-------------

export default router;
