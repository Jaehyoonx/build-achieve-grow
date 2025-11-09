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

//Gets a specific one
//Not implemented
router.get('/etfs/:source', async  (req, res) =>{
  await db.setCollection('etfs');
  res.status(501).send('Not implemented yet');
});
//-------------end of ETFS section-------------


export default router;