import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock Market Headlines API',
      version: '1.0.0',
      description: 'API for fetching and searching stock market news headlines, ETFs, and stocks',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API route files containing JSDoc comments
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Initialize Swagger documentation
 * @param {Express} app - Express application instance
 * @param {number} port - Port number the server is running on
 */
function swaggerDocs(app, port) {
  // Swagger UI page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

}

export default swaggerDocs;