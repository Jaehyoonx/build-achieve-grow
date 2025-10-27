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

## Phase 1
At this stage, the app is a basic full-stack prototype: the server provides two working API endpoints connected to MongoDB, and the client displays a simple component that fetches and shows a small piece of data. This confirms that the client, server, and database are successfully integrated.

### Goals
- Perform full stack project setup (server + client stubs, tests, DB hook-up).  
- Set up a GitLab CI job for linting and running stub tests.  
- Lay down the foundation for future phases with prototype-level functionality.

## Project Structure
```bash
project-root/
├── client/            # React front-end (Vite)
│   ├── public/        # Static assets (favicon, etc.)
│   └── src/           # React components
│
├── server/            # Express + MongoDB back-end
│   ├── bin/           # Entry point (www)
│   ├── db/            # Database connection
│   ├── routes/        # Express routes
│   ├── utils/         # Utility scripts (e.g. seed.js)
│   └── test/          # Mocha/Chai/Supertest tests
│
├── package.json       # Root scripts (start/build)
└── .gitlab-ci.yml     # CI pipeline config
```

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