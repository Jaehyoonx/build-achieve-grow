import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';

// Mock data to simulate MongoDB docs
const sampleStocks = [
  {
    _id: 1,
    fileName: 'AAPL',
    Date: '2025-11-09',
    Open: '180.12',
    High: '182.55',
    Low: '177.34',
    Close: '181.22',
    'Adj Close': '181.10',
    Volume: '50000000'
  },
  {
    _id: 2,
    fileName: 'GOOG',
    Date: '2025-11-09',
    Open: '140.00',
    High: '142.00',
    Low: '139.00',
    Close: '141.00',
    'Adj Close': '140.90',
    Volume: '20000000'
  }
];

// Test the /api/stocks endpoint
describe('GET /api/stocks', () => {
  beforeEach(() => {
    // Stub DB connection methods so no real MongoDB calls happen
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    // Mock the collection with find().toArray()
    db.collection = {
      find: sinon.stub().returns({
        limit: () => ({
          toArray: () => Promise.resolve(sampleStocks)
        })
      })
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an array of stocks', async () => {
    const res = await request(app).get('/api/stocks?limit=5');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.include.keys(
      'Symbol', 'Date', 'Open', 'High', 'Low', 'Close', 'AdjClose', 'Volume'
    );
    expect(res.body[0].Symbol).to.equal('AAPL');
    expect(res.body[0].Close).to.be.a('number');
  });
});

describe('GET /api/stocks/:symbol', () => {
  beforeEach(() => {
    // Stub DB connection methods so no real MongoDB calls happen
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    // Mock the collection with find().toArray()
    db.collection = {
      find: sinon.stub().returns({
        sort: () => ({
          toArray: () => 
            Promise.resolve(sampleStocks)
        })
      })
    };
  });
  
  afterEach(() => sinon.restore());

  it('should return all entries for a given symbol', async () => {
    const res = await request(app).get('/api/stocks/AAPL');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].Symbol).to.equal('AAPL');
    expect(res.body[0].Close).to.be.a('number');
  });
});

describe('GET /api/stocks/:symbol/latest', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    // simulate newest symbol stock entry first (sorted DESC)
    db.collection = {
      find: sinon.stub().returns({
        sort: () => ({
          limit: () => ({
            toArray: () => Promise.resolve([sampleStocks[0]])
          })
        })
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return the latest stock entry', async () => {
    const res = await request(app).get('/api/stocks/AAPL/latest');
    expect(res.status).to.equal(200);
    expect(res.body.Symbol).to.equal('AAPL');
    expect(res.body.Close).to.equal(181.22);
  });
});

describe('GET /api/stocks/search?start=&end=', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        toArray: () =>
          Promise.resolve(sampleStocks)
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return stock data within a date range', async () => {
    const res = await request(app).get('/api/stocks/search?start=2023-01-01&end=2023-01-31');
    expect(res.status).to.equal(200);
    expect(res.body[0]).to.include.keys('Symbol', 'Date', 'Close');
    expect(res.body[0].Date).to.equal('2025-11-09');
  });
});
