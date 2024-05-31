const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection string
const uri = "mongodb+srv://radevai1201:szZ2HmXFRc902EeW@cluster0.b8z5ks7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/";
// Connect to MongoDB
mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const messageSchema = new mongoose.Schema({
  type: Number,
  channel_id: String,
  content: String,
  attachments: [String],
  embeds: [String],
  timestamp: Date,
  edited_timestamp: { type: Date, default: null },
  flags: Number,
  components: [String],
  id: String,
  author: {
    id: String,
    username: String,
    avatar: { type: String, default: null },
    discriminator: String,
    public_flags: Number,
    flags: Number,
    banner: { type: String, default: null },
    accent_color: { type: Number, default: null },
    global_name: String,
    avatar_decoration_data: { type: String, default: null },
    banner_color: { type: String, default: null },
    clan: { type: String, default: null },
  },
  mentions: [String],
  mention_roles: [String],
  pinned: Boolean,
  mention_everyone: Boolean,
  tts: Boolean
});

const Message = mongoose.model('Message', messageSchema);

// Routes
app.get('/messages', async (req, res) => {
  try {
    const { filter, limit } = req.query;
    let query = {};
    if (filter) {
      query = JSON.parse(filter);
    }
    console.log(`Query: ${JSON.stringify(query)}, Limit: ${limit}`);
    const messages = await Message.find(query).limit(parseInt(limit, 10) || 0);
    console.log(`Messages Retrieved: ${JSON.stringify(messages)}`);
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.post('/messages/aggregate', async (req, res) => {
  try {
    const { pipeline } = req.body;
    console.log(`Pipeline: ${JSON.stringify(pipeline)}`);
    const result = await Message.aggregate(pipeline);
    console.log(`Aggregation Result: ${JSON.stringify(result)}`);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
