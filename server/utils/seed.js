//Will be used to populate the database
//This website was used to parse csv https://csv.js.org/parse/api/sync/ with the options https://csv.js.org/parse/options/
import {db} from '../db/db.js';
import fs from 'fs/promises'
import { parse } from "csv-parse/sync"
import { fileURLToPath } from 'url';
try {
  // TODO replace cluster0 with your db name
  
  await db.connect('bagdb');
  // TODO set the collection
  await db.setCollection("headlines");

  //will read all headlines
  const allHeadlines = ['cnbc_headlines.csv', 'guardian_headlines.csv', 'reuters_headlines.csv'];

  //------------Many CSV FILE READ--(headLines ONLY)-----READ THROUGH my comments to understand--------------

  for(const filename of allHeadlines){
    const fileContent = await fs.readFile(`./data/${filename}`, `utf8`)
    const records = parse(fileContent, {      
      columns: true, //This makes it use the first line as headers
      skip_empty_lines: true, //Skips empty line
      delimiter: ',' //Coloumn separator
    });
    await db.collection.insertMany(records);
  // use to test result
  //console.log(records);
  }
 

//--------------END OF THE Headlines CSV FILE READ-----------------------


await db.setCollection("stocks");
//-------------------Stock section---------------------------------------

//This will get all csv files in stocks dir
let allStockFiles = await fs.readdir('./data/stocks');
  for(const filename of allStockFiles){
    const fileContent = await fs.readFile(`./data/stocks/${filename}`, `utf8`)
    const records = parse(fileContent, {      
      columns: true, //This makes it use the first line as headers
      skip_empty_lines: true, //Skips empty line
      delimiter: ',' //Coloumn separator
    });
    await db.collection.insertMany(records);
    // use to test result
  //console.log(records);
}



//-----------------------END OF THE Stock CSV FILE READ------------------

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
