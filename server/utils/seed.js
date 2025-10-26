//Will be used to populate the database
//This website was used to parse csv https://csv.js.org/parse/api/sync/ with 
// the options https://csv.js.org/parse/options/
import {db} from '../db/db.js';
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
try {
  // TODO replace cluster0 with your db name
  
  await db.connect('bagdb');
  // TODO set the collection
  await db.setCollection('headlines');
  //clear old data since everytime u run db it might add on from what already exists
  await db.collection.deleteMany({});
  //will read all headlines
  const allHeadlines = ['cnbc_headlines.csv', 'guardian_headlines.csv', 'reuters_headlines.csv'];

  //------------Many CSV FILE READ--(headLines ONLY)-----READ THROUGH my comments to understand----

  const headLinePromises = allHeadlines.map(async filename => {
    const fileContent = await fs.readFile(`./data/${filename}`, `utf8`);
    const records = parse(fileContent, {      
      //This makes it use the first line as headers
      columns: true, 
      //Coloumn separator 
      delimiter: ',' 
    });
    return records;
  });
  //Flat makes the arrays turn to be [{}, {}] which Mongo accepts, but without it, 
  // just does [[{}], [{}]]
  const allHeadlineRecords = (await Promise.all(headLinePromises)).flat();
  await db.collection.insertMany(allHeadlineRecords);


 

  //--------------END OF THE Headlines CSV FILE READ-----------------------


  await db.setCollection('stocks');
  await db.collection.deleteMany({});
  //-------------------Stock section---------------------------------------

  //This will get all csv files in stocks dir
  const allStockFiles = await fs.readdir('./data/stocks');
  //This will go through each file name and read them and parse and return the records
  const stockPromises = allStockFiles.map(async filename => {
    const fileContent = await fs.readFile(`./data/stocks/${filename}`, `utf8`);
    const records = parse(fileContent, {      
      //This makes it use the first line as headers
      columns: true, 
      //Coloumn separator 
      delimiter: ',' 
    });
    return records;
  });
  //Flat makes the arrays turn to be [{}, {}] which Mongo accepts, but without it, 
  // just does [[{}], [{}]]
  const allStockRecords = (await Promise.all(stockPromises)).flat();
  await db.collection.insertMany(allStockRecords);

  //-----------------------END OF THE Stock CSV FILE READ------------------

  await db.setCollection('etfs');
  await db.collection.deleteMany({});
  //-------------------etfs section---------------------------------------
  //This will get all csv files in stocks dir
  const allETFFiles = await fs.readdir('./data/etfs');
  //This will go through each file name and read them and parse and return the records
  const etfsStocks = allETFFiles.map(async filename => {
    const fileContent = await fs.readFile(`./data/etfs/${filename}`, `utf8`);
    const records = parse(fileContent, {      
      //This makes it use the first line as headers
      columns: true, 
      //Coloumn separator 
      delimiter: ',' 
    });
    return records;
  });

  //Flat makes the arrays turn to be [{}, {}] which Mongo accepts, but without it, 
  // just does [[{}], [{}]]
  const allETFSRecords = (await Promise.all(etfsStocks)).flat();
  await db.collection.insertMany(allETFSRecords);
//-----------------------END OF THE etfs CSV FILE READ------------------
} catch (e) {
  console.error('could not seed', e);
} finally {
  //clean up at the end
  if (db) {
    db.close();
  }
  process.exit();
}

// This is just in case we can ignore the eslint warning about wait in a for loop. (Old code)
//  for(const filename of allETFFiles){
//     const fileContent = await fs.readFile(`./data/etfs/${filename}`, `utf8`);
//     const records = parse(fileContent, {      
//       //This makes it use the first line as headers
//       columns: true, 
//       //Skips empty line

//       //Ask teacher
//       // eslint-disable-next-line camelcase
//       skip_empty_lines: true,
//       //Coloumn separator 
//       delimiter: ',' 
//     });
//     await db.collection.insertMany(records);
//     // use to test result
//   //console.log(records);
//   }