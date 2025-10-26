import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();


//TODO Haider I left this for u
//app.use(express.static('ADD CLIENT STUFF HERE'));


await db.connect('bagdb');
//-------------ETFS section-------------
router.get('/etfs', async  (req, res) =>{
  await db.setCollection('etfs');
  res.status(500).send('Not implemented yet');
});

//Gets a specific one
router.get('/api/etfs/:source', async  (req, res) =>{
  await db.setCollection('etfs');
  res.status(500).send('Not implemented yet');
});
//-------------end of ETFS section-------------


export default router;