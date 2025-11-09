import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

//-------------ETFS section-------------

/*
  GET /api/etfs
  Returns all ETF data.
  Similar to the /api/stocks route, for now we simply fetch every document
  from the "etfs" collection using find({}) with no filters.
  
  Since our ETF dataset is small, we're not adding pagination or limits yet.
  Later if the dataset grows, we can introduce:
    - ?limit= number of ETFs to return
    - ?source= filter by data source
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
    res.status(500).json({ error: 'Failed to fetch ETFs' });
  }
});

/*
  GET /api/etfs/:source
  Returns ETF data for a specific source.
  Example: /api/etfs/yahoo or /api/etfs/nasdaq
  
  Here, "source" refers to the dataset origin field in our ETF collection.
  We search for a single document where source matches the URL parameter.
  
  If nothing is found, return 404 to indicate the ETF source does not exist.
*/
router.get('/etfs/:source', async (req, res) => {
  try {
    await db.setCollection('etfs');
    const { source } = req.params;

    // Find one ETF document that matches the given source
    const etf = await db.collection.findOne({ source });

    if (!etf) {
      return res.status(404).send('ETF not found');
    }

    res.status(200).json(etf);
  } catch (error) {
    console.error('Error fetching ETF:', error);
    res.status(500).json({ error: 'Failed to fetch ETF' });
  }
});
//-------------end of ETFS section-------------


export default router;