import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';

describe('GET /api/headlines', () => {
  before(() => {
    // Stub DB connection methods so no real MongoDB calls happen
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();
    // Stub the "collection" property and its "find" method
    db.collection = {
      find: sinon.stub().returns({
        limit: () => ({
          toArray: () => Promise.resolve([
            { _id: 1, title: 'Breaking News', source: 'Daily Times' },
            { _id: 2, title: 'Tech Stocks Up', source: 'MarketWatch' }
          ])
        })
      })
    };
  });

  it('should return an array of headlines', async () => {
    const res = await request(app).get('/api/headlines');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.deep.equal([
      { _id: 1, title: 'Breaking News', source: 'Daily Times' },
      { _id: 2, title: 'Tech Stocks Up', source: 'MarketWatch' }
    ]);
  });

  it('should contain objects with _id field', async () => {
    const res = await request(app).get('/api/headlines');
    expect(res.status).to.equal(200);
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('_id');
    }
  });
  after(() => {
    sinon.restore();
  });
});

describe('GET /api/headlines/:source', () => {
  before(() => {
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    db.collection = {
      find: sinon.stub().returns({
        limit: () => ({
          toArray: () => Promise.resolve([
            {
              _id: { $oid: '68fe67b4cb1417510d1a90a1' },
              Headlines: 'Cramer\'s lightning round: I would own Teradyne',
              Time: '7:33 PM ET Fri, 17 July 2020',
              Description: '"Mad Money" host Jim Cramer rings the lightning round bell.',
              fileName: 'cnbc_headlines'
            }
          ])
        })
      })
    };
  });

  it('should return headlines filtered by source', async () => {
    const response = await request(app).
      get('/api/headlines/cnbc_headlines').
      expect(200);

    expect(response.body).to.be.an('array');
    response.body.forEach(headline => {
      expect(headline.fileName).to.equal('cnbc_headlines');
    });
  });
  after(() => {
    sinon.restore();
  });
});
