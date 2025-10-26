//Will be used to populate the database
//This website was used to parse csv https://csv.js.org/parse/api/sync/ with the options https://csv.js.org/parse/options/
import {db} from '../db/db.js';
import fs from 'fs/promises'
import { parse } from "csv-parse/sync"
try {
  // TODO replace cluster0 with your db name
  
  await db.connect('bagdb');
  // TODO set the collection
  await db.setCollection("headlines");

  //will read all headlines
  
  //------------ONE CSV FILE READ--(cnbc)-----READ THROUGH my comments to understand--------------
  const fileContent = await fs.readFile('./data/cnbc_headlines.csv', 'utf8')
  const records = parse(fileContent, {
  columns: true, //This makes it use the first line as headers
  skip_empty_lines: true, //Skips empty line
  delimiter: ',' //Coloumn separator
});
// use to test result
  console.log(records);
//--------------END OF THE ONE CSV FILE READ-----------------------

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
