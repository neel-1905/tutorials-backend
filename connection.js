const { MongoClient } = require("mongodb");

const connection = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://neel1905:neel1905@cluster0.abtfoeg.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("tutorials");

  return { db };
};

module.exports = { connection };
