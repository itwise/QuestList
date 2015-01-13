'use strict';

var _ = require('lodash');
var Quest = require('./quest.model');

// Get list of quests
exports.index = function(req, res) {
  Quest.find(function (err, quests) {
    if(err) { return handleError(res, err); }
    return res.json(200, quests);
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
  Quest.create(req.body, function(err, quest) {
    if(err) { return handleError(res, err); }
    return res.json(201, quest);
  });
};

// Updates an existing quest in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Quest.findById(req.params.id, function (err, quest) {
    if (err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
    var updated = _.merge(quest, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, quest);
    });
  });
};

// Deletes a quest from the DB.
exports.destroy = function(req, res) {
  Quest.findById(req.params.id, function (err, quest) {
    if(err) { return handleError(res, err); }
    if(!quest) { return res.send(404); }
    quest.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}