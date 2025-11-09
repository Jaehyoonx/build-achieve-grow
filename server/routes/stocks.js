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
    res.status(404).json({error: 'Failed to fetch stocks'});
  }
});

//-------------Specific Stock Endpoints (Stubbed)-------------

/*
  GET /api/stocks/:symbol
  Returns stock data for a specific symbol (case-insensitive)
  Example: /api/stocks/AAPL
*/
router.get('/stocks/:symbol', async  (req, res) =>{
  await db.setCollection('stocks');
  res.status(501).send('Not implemented yet');
});

/*
  GET /api/stocks/:symbol/latest
  Returns the latest stock data for a specific symbol (case-insensitive)
  Example: /api/stocks/AAPL/latest
*/
router.get('/stocks/:symbol/latest', async  (req, res) =>{
  await db.setCollection('stocks');
  res.status(501).send('Not implemented yet');
}); 

/*
  GET /api/stocks/search?start=YYYY-MM-DD&end=YYYY-MM-DD
  Returns stock data within a specific date range
  Example: /api/stocks/search?start=2023-01-01&end=2023-01-31
*/
router.get('/stocks/search', async  (req, res) =>{
  await db.setCollection('stocks');
  res.status(501).send('Not implemented yet');
});

//-------------end of Stock section-------------

export default router;