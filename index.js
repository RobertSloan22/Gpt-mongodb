const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 27017;

const dbName = 'mongodb-chatbot-framework-chatbot';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  db = client.db(dbName);
  console.log('Connected to MongoDB');
});

app.use(express.json());


app.get('/messages', async (req, res) => {
  try {
    const collection = db.collection('messages');
    // Use channel_id as filter
    const filter = {channel_id:"1106390097378684983"};
    // Sort by 'createdAt' in descending order and limit to 50
    const data = await collection.find(filter).sort({createdAt: -1}).limit(50).toArray();
    // Extract 'content' from each document
    const contents = data.map(doc => doc.content);
    // Log the contents to the console
    console.log(contents);
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/messages/aggregate', async (req, res) => {
  try {
    const collection = db.collection('mongodb-chatbot-framework-chatbot');
    // Use channel_id as match condition in pipeline
    const pipeline = [{ $match: {channel_id:"1106390097378684983"} }, ...req.body.pipeline];
    const data = await collection.aggregate(pipeline).toArray();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
