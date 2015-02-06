'use strict';

var _ = require('lodash');
var Quest = require('./quest.model');
var QuestPool = require('../questPool/questPool.model');
var Comment = require('../comment/comment.model');

// Get list of quests
exports.index = function(req, res) {

  Quest.find({ user : req.user._id})
    .limit(10).sort('-startDate')
    .populate('questPool')
    .populate('user')
    .populate({ path : 'comments'})
    .exec(function(err, quests){
      if(err) { return handleError(res, err); }
      var options = {
        path : 'comments.user',
        model : 'User'
      };
      Comment.populate(quests, options, function(err, questList){
        return res.json(200, questList);
      });
  });
};

// Get a single quest
exports.show = function(req, res) {
  Quest.findById(req.params.id, function (err, quest) {
    if(err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
    return res.json(quest);
  });
};

// Creates a new quest in the DB.
exports.create = function(req, res) {
  var insertData = req.body;
  insertData.user = req.user._id;
  QuestPool.findOne({title : req.body.title},function(err, result){
    if(result){
      insertData.questPool = result._id;
      questCreate(insertData, res);
    }else{
      QuestPool.create({title : req.body.title, tags: req.body.tags}, function(err, questPool){
        insertData.questPool = questPool._id;
        questCreate(insertData, res);
      });
    }
  });
};

var questCreate = function(quest, res){
  Quest.create(quest, function(err, quest) {
    if(err) { return handleError(res, err); }
    return res.json(201, quest);
  });
}

// Updates an existing quest in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Quest.findById(req.params.id, function (err, quest) {
    if (err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
    var updated = _.merge(quest, { content : req.body.content });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      QuestPool.findById(quest.questPool, function(err, questPool){
        if (err) { return handleError(res, err); }
        if(!questPool) { return res.send(404); }
        var updatedQuestPool = _.merge(questPool, { title : req.body.questPool, tags : req.body.questPool.tags } );
        updatedQuestPool.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200, questPool);
        });
      });
    });
  });
};

// Deletes a quest from the DB.
exports.destroy = function(req, res) {
  Quest.findById(req.params.id, function (err, quest) {
    if(err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
      //quest remove
      quest.remove(function(err) {
        if(err) { return handleError(res, err); }
          //remove comments in quest
          Comment.find({ quest : req.params.id }, function(err, comments){
            comments.forEach(function(comment){
              comment.remove(function(err){
                if(err) { return handleError(res, err); }
                console.log(err);
                return res.send(204);
            });
          });
        });
    });

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
