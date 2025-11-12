import express from 'express';
import { db } from '../db/db.js';
//Since this is a router file and not the main it has to have this (Haider and Ryan)
const router = express.Router();

//---------------Header section--------------------
//This one is fully implemented
router.get('/headlines', async  (req, res) =>{
  try{
    await db.setCollection('headlines');
    //This will go in the collection and find everything (no filter since {})
    // and turn it into an array and store it here
    const headlines = await db.collection.find({}).toArray();
    res.json(headlines);
  } catch(error) {
    console.error('cant fetch', error);
    res.status(500).json({error: 'Failed to fetch headline'});
  }
});

//This route will get all headlines from a specific fileName 
router.get('/headlines/:source', async  (req, res) =>{
  try{ 
    await db.setCollection('headlines');
    const { source } = req.params;
    if (source !== 'cnbc_headlines' && source !== 'reuters_headlines'){
      res.status(400).json({error: 'No Source found'});
    }
    
    const headlines = await db.collection.find({fileName: source}).toArray();
    res.json(headlines);
  }catch(error){
    console.error('cant fetch', error);
    res.status(500).json({error: 'Failed to fetch headline'});
  }
});
//-------------End of Header senction-------------

export default router;