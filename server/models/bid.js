const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    project_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
  });

  module.exports = mongoose.model.Bid || mongoose.model('Bid', BidSchema);