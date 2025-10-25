//Will be used to populate the database
import {db} from '../db/db.js';
import fs from 'fs/promises'

try {
  // TODO replace cluster0 with your db name
  await db.connect('test');
  // TODO set the collection
  await db.setCollection("quote");
} catch (e) {
  console.error('could not seed');
  console.dir(e);
} finally {
  //clean up at the end
  if (db) {
    db.close();
  }
  process.exit();
}
