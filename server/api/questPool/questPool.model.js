'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestPoolSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  progressCount: {
    type: Number,
    default: 0
  },
  completeCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  availableUsers: [{
    ref: 'User',
    type: Schema.Types.ObjectId
  }],
  tags: [String]
});

module.exports = mongoose.model('QuestPool', QuestPoolSchema);
