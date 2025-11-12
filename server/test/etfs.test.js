import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';

// Mock data to simulate MongoDB ETF documents
const sampleEtfs = [
  {
    _id: 1,
    fileName: 'VOO',
    Date: '2025-11-09',
    Open: '450.12',
    High: '452.55',
    Low: '448.34',
    Close: '451.22',
    'Adj Close': '451.10',
    Volume: '1200000'
  },
  {
    _id: 2,
    fileName: 'VTI',
    Date: '2025-11-09',
    Open: '240.00',
    High: '242.00',
    Low: '238.00',
    Close: '241.00',
    'Adj Close': '240.90',
    Volume: '900000'
  }
];

// Tests for /api/etfs
describe('GET /api/etfs', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        limit: () => ({
          toArray: () => Promise.resolve(sampleEtfs)
        })
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return an array of ETFs with numeric fields', async () => {
    const res = await request(app).get('/api/etfs?limit=5');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.include.keys(
      'Symbol', 'Date', 'Open', 'High', 'Low', 'Close', 'AdjClose', 'Volume'
    );
    expect(res.body[0].Symbol).to.equal('VOO');
    expect(res.body[0].Close).to.be.a('number');
  });
});

// Tests for /api/etfs/:symbol
describe('GET /api/etfs/:symbol', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        toArray: () => Promise.resolve(sampleEtfs)
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return ETF entries for a given symbol', async () => {
    const res = await request(app).get('/api/etfs/VOO');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].Symbol).to.equal('VOO');
    expect(res.body[0].Close).to.be.a('number');
  });

  it('should return 404 if ETF symbol not found', async () => {
    db.collection.find.returns({
      toArray: () => Promise.resolve([])
    });
    const res = await request(app).get('/api/etfs/XYZ');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});

// Tests for /api/etfs/:symbol/latest
describe('GET /api/etfs/:symbol/latest', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        sort: () => ({
          limit: () => ({
            toArray: () => Promise.resolve([sampleEtfs[0]])
          })
        })
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return the latest ETF entry', async () => {
    const res = await request(app).get('/api/etfs/VOO/latest');
    expect(res.status).to.equal(200);
    expect(res.body.Symbol).to.equal('VOO');
    expect(res.body.Close).to.equal(451.22);
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
});

// Tests for /api/etfs/search
describe('GET /api/etfs/search', () => {
  beforeEach(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        toArray: () => Promise.resolve(sampleEtfs)
      })
    };
  });

  afterEach(() => sinon.restore());

  it('should return ETF data within a date range', async () => {
    const res = await request(app).get('/api/etfs/search?start=2025-01-01&end=2025-12-31');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].Symbol).to.equal('VOO');
  });
});
