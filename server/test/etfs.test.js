import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';

// Tests for /api/etfs
describe('GET /api/etfs', () => {
  before(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    // Mock MongoDB collection find().toArray()
    db.collection = {
      find: sinon.stub().returns({
        toArray: () => Promise.resolve([
          { _id: 1, symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
          { _id: 2, symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' }
        ])
      })
    };
  });

  it('should return an array of ETFs', async () => {
    const res = await request(app).get('/api/etfs');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.deep.equal([
      { _id: 1, symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
      { _id: 2, symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' }
    ]);
  });

  it('should handle internal server error gracefully', async () => {
    // Force a DB error
    db.collection.find.throws(new Error('DB failure'));
    const res = await request(app).get('/api/etfs');
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property('error');
  });

  after(() => {
    sinon.restore();
  });
});

// Tests for /api/etfs/:symbol
describe('GET /api/etfs/:symbol', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().callsFake(({ symbol }) => {
        if (symbol === 'VOO') {
          return {
            toArray: () =>
              Promise.resolve([
                { _id: 1, symbol: 'VOO', name: 'Vanguard S&P 500 ETF' }
              ])
          };
        }
        return { toArray: () => Promise.resolve([]) };
      })
    };
  });

  it('should return a specific ETF by symbol', async () => {
    const res = await request(app).get('/api/etfs/VOO');
    expect(res.status).to.equal(200);
    expect(res.body[0]).to.include({ symbol: 'VOO' });
  });

  it('should return 404 if ETF symbol not found', async () => {
    const res = await request(app).get('/api/etfs/XYZ');
    expect(res.status).to.equal(404);
  });

  afterEach(() => sinon.restore());
});

// Tests for /api/etfs/:symbol/latest
describe('GET /api/etfs/:symbol/latest', () => {
  beforeEach(() => {
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        sort: () => ({
          limit: () => ({
            toArray: () =>
              Promise.resolve([
                { _id: 1, symbol: 'VOO', Date: '2024-12-31', Close: '412.30' }
              ])
          })
        })
      })
    };
  });

  it('should return the latest ETF entry for a symbol', async () => {
    const res = await request(app).get('/api/etfs/VOO/latest');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('symbol', 'VOO');
  });

  it('should return 404 if no latest data found', async () => {
    db.collection.find.returns({
      sort: () => ({
        limit: () => ({
          toArray: () => Promise.resolve([])
        })
      })
    });
    const res = await request(app).get('/api/etfs/XYZ/latest');
    expect(res.status).to.equal(404);
  });

  afterEach(() => sinon.restore());
});

// Tests for /api/etfs/search
describe('GET /api/etfs/search', () => {
  beforeEach(() => {
    sinon.stub(db, 'setCollection').resolves();
  });

  it('should return ETF data between start and end dates', async () => {
    db.collection = {
      find: sinon.stub().returns({
        toArray: () =>
          Promise.resolve([
            { _id: 1, symbol: 'VOO', Date: '2023-01-10', Close: '382.11' },
            { _id: 2, symbol: 'VTI', Date: '2023-01-15', Close: '200.45' }
          ])
      })
    };

    const res = await request(app).get(
      '/api/etfs/search?start=2023-01-01&end=2023-02-01'
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });

  afterEach(() => sinon.restore());
});
