'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestPoolSchema = new Schema({
  title: {
    type: String,
    required: true
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
  tags: [String],
  createUser: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true
  }
});

QuestPoolSchema.index({title : 1, createUser : 1}, {unique : true});

//<collection>.dropIndexes({key:1 or -1}) ex) db.things.dropIndexes({age:1});

module.exports = mongoose.model('QuestPool', QuestPoolSchema);
