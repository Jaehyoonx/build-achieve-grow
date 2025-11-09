import express from 'express';
import headlineRoute from './routes/headlines.js';
import etfsRoute from './routes/etfs.js';
import stockRoute from './routes/stocks.js';

const app = express();
const port = 3000;

app.use(express.static('../client/dist'));

app.use('/api', headlineRoute);
app.use('/api', etfsRoute);
app.use('/api', stockRoute);

export default app;
export { port };
