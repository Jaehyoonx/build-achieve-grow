import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

//---------------Header section--------------------

/**
 * @swagger
 * /api/headlines:
 *   get:
 *     tags:
 *       - Headlines
 *     summary: Get all headlines
 *     description: Retrieve all headlines from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved headlines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "507f1f77bcf86cd799439011"
 *                   Headlines:
 *                     type: string
 *                     example: "Tesla Stock Soars After Earnings"
 *                   Time:
 *                     type: string
 *                     example: "2024-01-15"
 *                   Description:
 *                     type: string
 *                     example: "Tesla reported record quarterly earnings..."
 *                   Company:
 *                     type: string
 *                     example: "Tesla"
 *                   fileName:
 *                     type: string
 *                     example: "cnbc_headlines"
 *       500:
 *         description: Failed to fetch headlines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch headline"
 */
router.get('/headlines', async (req, res) => {
  try {
    await db.setCollection('headlines');
    const limit = parseInt(req.query.limit) || 300;
    if(limit > 300 || limit < 1){
      return res.status(400).json({
        error: 'Limit must be a number betweek 1 and 300'
      });
    }
    const headlines = await db.collection.find({}).limit(limit).toArray();

    //Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');
    
    res.json(headlines);
  } catch (error) {
    console.error('cant fetch', error);
    res.status(500).json({ error: 'Failed to fetch headline' });
  }
});

/**
 * @swagger
 * /api/headlines/{source}:
 *   get:
 *     tags:
 *       - Headlines
 *     summary: Get headlines from a specific source
 *     description: Retrieve headlines filtered by news source (CNBC or Reuters)
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - cnbc_headlines
 *             - reuters_headlines
 *         description: News source identifier
 *         example: cnbc_headlines
 *     responses:
 *       200:
 *         description: Successfully retrieved headlines from specified source
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   Headlines:
 *                     type: string
 *                   Time:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Company:
 *                     type: string
 *                   fileName:
 *                     type: string
 *       400:
 *         description: Invalid source provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Source found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch headline"
 */
router.get('/headlines/:source', async (req, res) => {
  try { 
    await db.setCollection('headlines');
    const { source } = req.params;
    
    if (source !== 'cnbc_headlines' && source !== 'reuters_headlines') {
      return res.status(400).json({ error: 'No Source found' }); 
    } 
    

    const limit = parseInt(req.query.limit) || 300;
    if(limit > 300 || limit < 1){
      return res.status(400).json({
        error: 'Limit must be a number betweek 1 and 300'
      });
    }
    const headlines = await db.collection.find({ fileName: source }).limit(limit).toArray();

    //Cache Control improvement for 1 hour
    res.set('Cache-Control', 'public, max-age=3600');

    res.json(headlines);
    
  } catch (error) {
    console.error('cant fetch', error);
    res.status(500).json({ error: 'Failed to fetch headline' });
  }
});

//-------------End of Header section-------------

export default router;