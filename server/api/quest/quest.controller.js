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
    .populate('likes')
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
  Quest.find({ user : req.params.id })
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

// Creates a new quest in the DB.
exports.create = function(req, res) {
  var insertData = req.body;
  insertData.user = req.user._id;

  if(insertData.questPool){ //기존에 questPool 자동생성성
    console.log("================================");
    console.log(insertData);
    QuestPool.findOne({
      $and : [
        {
          $or: [
            { title: insertData.questPool.title },
            { _id : insertData.questPool._id }
          ]
        },
        {
          createUser : insertData.user
        }
      ]
    },function(err, result){
      if(!result){
        console.log("result null");
        console.log(insertData);
        QuestPool.create(
          { title : insertData.questPool.title,
            tags : insertData.questPool.tags,
            createUser : insertData.user
          }, function(err, questPool){
            console.log(err);
            console.log(questPool);
            insertData.questPool = questPool._id;
            questCreate(insertData, res);
          });
      }else{
        insertData.questPool = result._id;
        questCreate(insertData, res);
      }
      console.log(err);
    });
  }else{ //Timeline에서 글쓸때
    console.log(insertData);

    QuestPool.findOne({
      $and : [
        { title : insertData.title },
        {
          createUser : insertData.user
        }
      ]
    },function(err, result){
      if(!result){
        console.log("result null");
        console.log(insertData);
        QuestPool.create(
          { title : insertData.title,
            tags : insertData.tags,
            createUser : insertData.user
          }, function(err, questPool){
            console.log(err);
            insertData.questPool = questPool._id;
            questCreate(insertData, res);
          });
      }else{
        insertData.questPool = result._id;
        questCreate(insertData, res);
      }
      console.log(err);
    });
  }
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
    console.log(updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      QuestPool.update({_id: req.body.questPool._id}, {
        $set:{
          title : req.body.questPool.title,
          tags : req.body.questPool.tags,
          completeCount : req.body.questPool.completeCount
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
  var msg = "";
  var retCode = "success";
  var questId = req.body.questId;
  var userId = req.user._id;
  Quest.findOne({_id : questId, likes : {$ne : userId}}, function(err, quest){
    if(quest){
      quest.likes.push(userId);
      quest.save(function(err){
        return res.json(500, {msg : 'Internal Server Exception'})
      });
      retCode = "success";
      msg = "처리 되었습니다. ";
    }else{
      retCode = "fail";
      msg = "이미 처리 되었습니다.";
    }
    return res.json(200, {retCode : retCode, msg : msg, userId : userId, likes : quest.likes });
  });
}

exports.getQuestByTag = function(req, res){
  var tag = req.params.tag;

  QuestPool.find({tags : tag}, function(err, questPool){
    var questPoolList = _.pluck(questPool, '_id');

    Quest.find({questPool : {$in : questPoolList}})
      .populate('questPool user likes')
      .populate({path : 'comments'})
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

  });

}
function handleError(res, err) {
  return res.send(500, err);
}
