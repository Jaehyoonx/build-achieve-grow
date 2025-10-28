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
    res.status(404).json({error: 'Failed to fetch headline'});
  }
});

//Not implemented
router.get('/headlines/:source', async  (req, res) =>{
  await db.setCollection('headlines');
  res.status(501).send('Not implemented yet');
});
//-------------End of Header senction-------------
  

export default router;