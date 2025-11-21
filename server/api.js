import express from 'express';
import compression from 'compression';
import swaggerDocs from './swagger.js'; 
import process from 'node:process';

import headlineRoute from './routes/headlines.js';
import etfsRoute from './routes/etfs.js';
import stockRoute from './routes/stocks.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3001;

// Middleware
// Enable gzip compression for all responses
app.use(compression());
app.use(express.static('../client/dist'));

// API Routes
app.use('/api', headlineRoute);
app.use('/api', etfsRoute);
app.use('/api', stockRoute);

// Initialize Swagger Documentation
swaggerDocs(app, port); 

export default app;
export { port, isProduction };