import express from 'express';
import { db } from '../db/db.js';
//Since this is a router file and not the main it has to have this (Haider and Ryan)
const app = express();
const port = 3000;

//TODO Haider I left this for u
//app.use(express.static('ADD CLIENT STUFF HERE'));




async function startServer(){
  await db.connect('bagdb');
  try {
    const server = router.listen(port, () => {
      console.error(`Example app app listening at http://localhost:${port}`);
    });
    //SIGTERM doesn't work on Windows. This works when the server is a Unix process and we `kill` it
    process.on('SIGTERM', () => {
      console.error('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.error('HTTP server closed');
      });
    });
  } catch (err) {
    console.error('Error while starting', err.message);
    process.exit(1);
  }
}
startServer();