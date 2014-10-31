'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestSchema = new Schema({
    name: String,
    tag: String,
    register : {
        type : Schema.ObjectId,
        ref : 'User'
    },
    created : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Quest', QuestSchema);