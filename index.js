const express = require('express');
const FilecoinClient = require('filecoin-api-client');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const client = FilecoinClient.newClient({ url: 'http://127.0.0.1:1234/rpc/v0' });
const MONGODB_URI = 'mongodb://localhost:27017';
const MONGODB_DB_NAME = 'filecoin_metadata_explorer';
const MONGODB_COLLECTION_NAME = 'metadata';

let db;

(async () => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
})();

app.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const chainHead = await client.chain.head();
    const results = await searchMetadata(keyword, chainHead);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch metadata' });
  }
});

async function searchMetadata(keyword, chainHead) {
  try {
    const collection = db.collection(MONGODB_COLLECTION_NAME);
    const query = { $text: { $search: keyword } };
    const results = await collection.find(query).toArray();

    return results.map((result) => ({
      cid: result.cid,
      metadata: {
        title: result.title,
        description: result.description,
        type: result.type,
        size: result.size,
      },
    }));
  } catch (error) {
    console.error('Error when looking for metadata in MongoDB:', error);
    return [];
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
