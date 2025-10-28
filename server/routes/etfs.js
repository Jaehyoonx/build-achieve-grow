import express from 'express';
import { db } from '../db/db.js';
const router = express.Router();

//-------------ETFS section-------------
//Not implemented
router.get('/etfs', async  (req, res) =>{
  await db.setCollection('etfs');
  res.status(501).send('Not implemented yet');
});

//Gets a specific one
//Not implemented
router.get('/etfs/:source', async  (req, res) =>{
  await db.setCollection('etfs');
  res.status(501).send('Not implemented yet');
});
//-------------end of ETFS section-------------


export default router;