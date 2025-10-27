import request from 'supertest';
import { expect } from 'chai';
import app from '../api.js';

// Test the /api/stocks endpoint
describe('GET /api/stocks', () => {
  it('should return an array of stocks', async () => {
    const res = await request(app).get('/api/stocks?limit=5');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should contain objects with _id field', async () => {
    const res = await request(app).get('/api/stocks?limit=5');
    expect(res.status).to.equal(200);
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('_id');
    }
  });
});
