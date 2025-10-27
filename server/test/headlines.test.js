import request from 'supertest';
import { expect } from 'chai';
import app from '../api.js';

describe('GET /api/headlines', () => {
  it('should return an array of headlines', async () => {
    const res = await request(app).get('/api/headlines');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should contain objects with _id field', async () => {
    const res = await request(app).get('/api/headlines');
    expect(res.status).to.equal(200);
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('_id');
    }
  });
});
