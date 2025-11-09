import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../api.js';
import { db } from '../db/db.js';

// Tests for /api/etfs
describe('GET /api/etfs', () => {
  before(() => {
    // Fake DB methods so no real MongoDB connection happens
    sinon.stub(db, 'connect').resolves();
    sinon.stub(db, 'setCollection').resolves();

    // Mock MongoDB collection find().toArray()
    db.collection = {
      find: sinon.stub().returns({
        toArray: () => Promise.resolve([
          { _id: 1, source: 'yahoo', name: 'Vanguard S&P 500 ETF' },
          { _id: 2, source: 'nasdaq', name: 'iShares Core MSCI World ETF' }
        ])
      })
    };
  });
