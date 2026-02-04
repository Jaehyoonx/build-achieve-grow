//data base section that will create and connect stuff to db
import { MongoClient, ServerApiVersion } from 'mongodb';
import process from 'node:process';

// Only load .env file in development (Render sets env vars directly in production)
if (process.env.NODE_ENV !== 'production') {
  process.loadEnvFile();
}

const dbUrl = process.env.ATLAS_URI;

let instance = null;

class DB {
  constructor() {
    //instance is the singleton, defined in outer scope
    if (!instance) {
      instance = this;
      this.mongoClient = null;
      this.db = null;
      this.collection = null;
    }
    return instance;
  }
  //Only connect to database if not already connected
  async connect(dbName) {
    if (instance.db){
      return;
    }
    this.mongoClient = new MongoClient(dbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await instance.mongoClient.connect();
    instance.db = await instance.mongoClient.db(dbName);
    // Send a ping to confirm a successful connection
    await instance.mongoClient.db(dbName).command({ ping: 1 });
    // console.log('Successfully connected to MongoDB database ' + dbName);
  }
  //set the collection desired
  async setCollection(collectionName) {
    instance.collection = await instance.db.collection(collectionName);
  }
  async insertMany(data){
    return await instance.collection.insertMany(data);
  }
  //close the connection when gracefully shutting down
  async close() {
    await instance.mongoClient.close();
    this.db = null;
    this.collection = null;
  }
}

export const db = new DB();
