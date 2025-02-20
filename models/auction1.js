const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  bids: [
    {
      username: { type: String, required: true },
      bidAmount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
