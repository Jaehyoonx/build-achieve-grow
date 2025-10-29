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
        toArray: () => Promise.resolve([
          { _id: 1, title: 'Breaking News', source: 'Daily Times' },
          { _id: 2, title: 'Tech Stocks Up', source: 'MarketWatch' }
        ])
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

describe.skip('GET /api/headlines/:source', () => {
  it('should return headlines filtered by source', async () => {
    // TODO: implement in Phase 2
  });
});
