const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Model for Bids
const bidSchema = new mongoose.Schema({
  item: String,
  bidAmount: Number,
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model('Bid', bidSchema);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Route to handle bid submission
app.post('/place-bid', async (req, res) => {
  try {
    const { item, bidAmount } = req.body;

    // Save the bid to the database
    const newBid = new Bid({ item, bidAmount });
    await newBid.save();

    console.log('Bid placed successfully:', newBid);
    res.send(`<h1>Bid placed successfully for ${item}!</h1>`);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).send('Failed to place bid.');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
