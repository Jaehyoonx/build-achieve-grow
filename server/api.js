import express from 'express';
import { db } from '../db/db.js';
import headlineRoute from './routes/headlines.js';
import etfsRoute from './routes/etfs.js';
import stockRoute from './routes/stocks.js';
const app = express();
const port = 3000;

//TODO Haider I left this for u
//app.use(express.static('ADD CLIENT STUFF HERE'));




async function startServer(){
  await db.connect('bagdb');

  app.use('/api', headlineRoute);
  app.use('/api', etfsRoute);
  app.use('/api', stockRoute);
  try {
    const server = app.listen(port, () => {
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