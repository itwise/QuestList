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
    .populate('user')git
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
      console.log(req.body.tags);
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
  if(req.body._id) { delete req.body._id; };

  Quest.findById(req.params.id, function (err, quest) {
    if (err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
    var updated = _.merge(quest, { content : req.body.content, status : req.body.status, completeDate : req.body.completeDate });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      QuestPool.update({_id: req.body.questPool._id}, {
        $set:{
          title : req.body.questPool.title,
          tags : req.body.questPool.tags
        }
      }, function(err, questPool){
        if (err) { return handleError(res, err); }
        console.log(err);
        return res.send(204);
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
            });
          });
            res.end();
            return res.send(204);
        });
    });

  });
};
exports.like = function(req, res){
  console.log('like');
  console.log(req.body);
  Quest.findById(req.body.questId, function(err, quest){
    console.log('quest start');

    if(quest){
      console.log(quest);
      if(_.indexOf(quest.likes) === -1){
        quest.likes.push(req.user._id);
        quest.save(function(err){
          console.log(err);
        });
      }
    }
  });
  return res.json(200, {test: 'aaa'});
}
function handleError(res, err) {
  return res.send(500, err);
}
