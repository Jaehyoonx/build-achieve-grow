import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';


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
          toArray: () => Promise.resolve([
            { _id: 1, symbol: 'AAPL', price: 180 },
            { _id: 2, symbol: 'GOOG', price: 140 }
          ])
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
    expect(res.body).to.deep.equal([
      { _id: 1, symbol: 'AAPL', price: 180 },
      { _id: 2, symbol: 'GOOG', price: 140 }
    ]);
  });

  it('should contain objects with _id field', async () => {
    const res = await request(app).get('/api/stocks?limit=5');
    expect(res.status).to.equal(200);
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('_id');
    }
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
        toArray: () => 
          Promise.resolve([
            { _id: 1, symbol: 'AAPL', price: 180 },
            { _id: 2, symbol: 'GOOG', price: 140 }
          ])
      })
    };
  });
  
  afterEach(() => sinon.restore());

  it('should return all entries for a given symbol', async () => {
    const res = await request(app).get('/api/stocks/AAPL');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].symbol).to.equal('AAPL');
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
            toArray: () =>
              Promise.resolve([{ _id: 99, symbol: 'AAPL', price: 200, date: '2025-11-09' }])
          })
        })
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return the latest stock entry', async () => {
    const res = await request(app).get('/api/stocks/AAPL/latest');
    expect(res.status).to.equal(200);
    expect(res.body.symbol).to.equal('AAPL');
    expect(res.body.price).to.equal(200);
  });
});

describe('GET /api/stocks/search?start=&end=', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        toArray: () =>
          Promise.resolve([
            { _id: 1, symbol: 'AAPL', date: '2023-01-05', price: 150 }
          ])
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return stock data within a date range', async () => {
    const res = await request(app).get('/api/stocks/search?start=2023-01-01&end=2023-01-31');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].date).to.equal('2023-01-05');
  });
});
