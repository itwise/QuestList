'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProgressquestSchema = new Schema({
    name: String,
    quest : {
        type : Schema.ObjectId,
        ref : 'Quest'
    },
    status: Boolean,
    user : {
        type : Schema.ObjectId,
        ref : 'User'
    },
    created : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Progressquest', ProgressquestSchema);

exports.getProgressQuestByUser = function(user){
    var progressQuests = [];
    ProgressquestSchema.find({user : user})
        .populate('user quest')
        .exec(function(err, progressQuests){
            if(err) return handleError(err);
            progressQuests = progressQuests;
        });
    return progressQuests;
}
