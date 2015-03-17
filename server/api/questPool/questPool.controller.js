'use strict';

var _ = require('lodash');
var Questpool = require('./questPool.model');

// Get list of questPools
exports.index = function(req, res) {
  var date = new Date(),
    day = date.getDate() - 7,
    month = date.getMonth(),
    year = date.getFullYear();

  Questpool.find({ updatedAt : {$lt : new Date(), $gt: new Date(year +','+month+','+day)}})
    .sort('-completeCount')
    .exec(function (err, questPools) {
      if(err) { return handleError(res, err); }
      return res.json(200, questPools);
    });
};

// Get a single questPool
exports.show = function(req, res) {
  Questpool.findById(req.params.id, function (err, questPool) {
    if(err) { return handleError(res, err); }
    if(!questPool) { return res.send(404); }
    return res.json(questPool);
  });
};

// Creates a new questPool in the DB.
exports.create = function(req, res) {
  Questpool.create(req.body, function(err, questPool) {
    if(err) { return handleError(res, err); }
    return res.json(201, questPool);
  });
};

// Updates an existing questPool in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Questpool.findById(req.params.id, function (err, questPool) {
    if (err) { return handleError(res, err); }
    if(!questPool) { return res.send(404); }
    var updated = _.merge(questPool, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, questPool);
    });
  });
};

// Deletes a questPool from the DB.
exports.destroy = function(req, res) {
  Questpool.findById(req.params.id, function (err, questPool) {
    if(err) { return handleError(res, err); }
    if(!questPool) { return res.send(404); }
    questPool.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

/**
 * get QuestPool rank
 * 1. 중복된 title 불러오면 안된다
 * 2. complete count  내림차순으로
 */
exports.questRank = function(req, res){
  Questpool.find({}).limit(10)
    .sort('-completeCount')
    .exec(function (err, questPools) {
      if(err) { return handleError(res, err); }
      return res.json(200, questPools);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
