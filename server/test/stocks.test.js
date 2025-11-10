import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';


// Test the /api/stocks endpoint
describe('GET /api/stocks', () => {
  before(() => {
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

  after(() => {
    sinon.restore();
  });
});

describe('GET /api/stocks/:symbol', () => {
  before(() => {
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
  it('should return all entries for a given symbol', async () => {
    const res = await request(app).get('/api/stocks/AAPL');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].symbol).to.equal('AAPL');
  });

  after(() => sinon.restore());
});

describe.skip('GET /api/stocks/:symbol/latest', () => {
  it('should return the latest stock data for a specific symbol', async () => {
    // TODO: Implement in Phase 2
  });
});

describe.skip('GET /api/stocks/search?start=&end=', () => {
  it('should return stock data within a date range', async () => {
    // TODO: Implement in Phase 2
  });
});
