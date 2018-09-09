const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = Schema({
    owner_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
        type: String
    },
    budget :{
        type: Number,
        required: true,
    },
    completeBy: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Auction', 'Sold', 'Unsold', 'Cancelled' ,'Complete'],
        default: 'Auction',
    },
    bidStarts: {
        type: Date,
        required: true,
        default: Date.now
    },
    bidEnds: {
        type: Date,
        required: true,
        $gt: Date.now
    },
    winningBid: {
        bid_id: {
            type: Schema.Types.ObjectId
        },
        user_id: {
            type: Schema.Types.ObjectId
        },
        amount: {
            type: Number
        }
    },
    totalBids :{
        type: Number,
        required: true,
        default: 0
    },

  });

  ProjectSchema.post('find', function(docs, next) {
    //console.log(docs)
    //let updateDocs = [];
    docs.forEach((doc) =>{
        let current =  new Date();
        if(doc.bidEnds < current){
            if(doc.status == 'Auction'){//needs update
                if(doc.totalBids <= 0){
                    doc.status = 'Unsold';
                }
                else doc.status = 'Sold';
                doc.save();
            }
        }
    })
    next();

  });

  ProjectSchema.post('findOne', function(doc) {
    console.log('this fired after you run a findOne query');
  });

  module.exports = mongoose.model.Project || mongoose.model('Project', ProjectSchema);