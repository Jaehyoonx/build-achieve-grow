# Web Project – B.A.G. (Build, Achieve, Grow)
**Course:** 420-520-DW  
**Semester:** Fall 2025  
**Team Members:**  
- Ryan Bui (Checker)
- Haider Ahmed (Coordinator)
- Christian Graceffa (Monitor)

---

## Description
The **B.A.G.** is a full-stack **Express + React** web application that visualizes the performance of major **Exchange-Traded Funds (ETFs)** from multiple industries, including **Technology, Finance, Energy, and Healthcare**.  

Users can explore and compare trends across industries, view live or historical performance data, and access summaries and insights for each ETF.  
As developers, our goal is to provide a clean, fast, and interactive interface that helps users understand how different sectors are performing in global markets.

All core data is processed on the **Express server** and stored in **MongoDB**, while the **React client** handles visualization, filtering, and dynamic interactions.

---

## Phase 2 Summary
Phase 2 focuses on implementing the client-side features and improving the server-side API with documentation and testing.

### Implemented Deliverables
**Client-Side**
- React Components:
  - EtfCard, EtfGrid, EtfDetail, EtfChart
  - StockCard, StockGrid, StockDetail, StockChart
  - HeadlineList, NewsFeed, CompareChart, SearchBar, Footer
- Interactive visualizations using Recharts.
- Routing & Interaction: Clickable cards to access detailed chart views.
- Error & Loading States: Friendly UI messages and fail-gracefully design.
- Accessibility and semantic layout.

**Server-Side**
- Express Endpoints:
  - /api/stocks, /api/stocks/:symbol, /api/stocks/:symbol/latest
  - /api/etfs, /api/etfs/:source
  - /api/headlines
- Swagger Documentation: Accessible at /api-docs with OpenAPI annotations.
- Unit Tests: Mocha/Chai/Supertest suites for etfs.js and stocks.js.
- CI/CD Integration: GitLab CI pipeline runs linting, build, and tests.
- Bundle Size Monitoring: bundlesize2 tracks JS/CSS build weights.

**New Additions**
- Added NewsFeed and HeadlineList components for displaying financial headlines.
- Integrated Swagger documentation for API.
- Organized code into /components and /views for maintainability.
- Added CompareStocks and CompareEtfs pages.

### Goals
- Perform full stack project setup (server + client stubs, tests, DB hook-up).  
- Set up a GitLab CI job for linting and running stub tests.  
- Lay down the foundation for future phases with prototype-level functionality.

## Project Structure
```bash
project-root/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── CompareChart.jsx
│       │   ├── EtfCard.jsx
│       │   ├── EtfChart.jsx
│       │   ├── EtfGrid.jsx
│       │   ├── Footer.jsx
│       │   ├── Footer.css
│       │   ├── HeadlineList.jsx
│       │   ├── NewsFeed.jsx
│       │   ├── SearchBar.jsx
│       │   ├── StockCard.jsx
│       │   ├── StockChart.jsx
│       │   └── StockGrid.jsx
│       │
│       ├── views/
│       │   ├── CompareEtfs.jsx
│       │   ├── CompareStocks.jsx
│       │   ├── EtfDetail.jsx
│       │   ├── Home.jsx
│       │   ├── NewsPage.jsx
│       │   └── StockDetail.jsx
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── routes/
│   ├── db/
│   ├── utils/
│   ├── test/
│   ├── swagger.js
│   └── bin/www
│
├── package.json
└── .gitlab-ci.yml
```

## Data Sources and Attributions
This project uses public datasets from Kaggle for educational purposes only:

- Stock Market Dataset by jacksoncrow: https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset
- Financial News Headlines Dataset by ankurzing: https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news

**Libraries and Tools:** React, Express, MongoDB, Recharts, Mocha/Chai/Supertest, Swagger UI, bundlesize2

## API Documentation
All routes are documented using Swagger.

## Running the Client (Development)
```bash
cd client
npm install
npm run dev
```

## Running the Client (Development)
```bash
cd server
npm install
npm run dev
```

## Seeding the database 
```bash
cd server
node utils/seed.js
```

## Running in production
```bash
# Build the React client
cd client
npm install
npm run build

# Go back to project root and install server deps
cd ../server
npm install

# Start the server (serves both API + built client)
npm start
```

## Acknowledgements
This project was developed for Dawson College, Computer Science Technology (420-520-DW) by Haider, Ryan, Christian
under the supervision of Maja Frydrychowicz.