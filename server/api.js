import express from 'express';
import swaggerDocs from './swagger.js'; 

import headlineRoute from './routes/headlines.js';
import etfsRoute from './routes/etfs.js';
import stockRoute from './routes/stocks.js';

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); 
app.use(express.static('../client/dist'));

// API Routes
app.use('/api', headlineRoute);
app.use('/api', etfsRoute);
app.use('/api', stockRoute);

// Initialize Swagger Documentation
swaggerDocs(app, port); 

export default app;
export { port };