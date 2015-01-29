'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestSchema = new Schema({
  content: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  completeDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'START'
  },
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true
  },
  questPool: {
    ref: 'QuestPool',
    type: Schema.Types.ObjectId,
    required: true
  },
  comments : [{
    ref : 'Comment',
    type : Schema.Types.ObjectId,
    required : false
  }]

});

module.exports = mongoose.model('Quest', QuestSchema);
