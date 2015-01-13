'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content: String,
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  quest: {
    ref: 'Quest',
    type: Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
