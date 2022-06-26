const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;
let mongodbUrl = 'mongodb://127.0.0.1:27017';

if(process.env.MONGODB_URL){
  mongodbUrl = process.env.MONGODB_URL;
}

async function connectToDatabase() {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db("online-shop")
}

function getDb(){
    if(!database){
        throw new Error("You must connect to a database first");
    }
    return database
}

module.exports={
    connectToDatabase: connectToDatabase,
    getDb: getDb,
}


