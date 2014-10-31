'use strict';

var _ = require('lodash');
var Progressquest = require('./progressQuest.model');

// Get list of progressQuests
exports.index = function(req, res) {
  Progressquest.find(function (err, progressQuests) {
    if(err) { return handleError(res, err); }
    return res.json(200, progressQuests);
  });
};

// Get a single progressQuest
exports.show = function(req, res) {
  Progressquest.findById(req.params.id, function (err, progressQuest) {
    if(err) { return handleError(res, err); }
    if(!progressQuest) { return res.send(404); }
    return res.json(progressQuest);
  });
};

// Creates a new progressQuest in the DB.
exports.create = function(req, res) {
  Progressquest.create(req.body, function(err, progressQuest) {
    if(err) { return handleError(res, err); }
    return res.json(201, progressQuest);
  });
};

// Updates an existing progressQuest in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Progressquest.findById(req.params.id, function (err, progressQuest) {
    if (err) { return handleError(res, err); }
    if(!progressQuest) { return res.send(404); }
    var updated = _.merge(progressQuest, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, progressQuest);
    });
  });
};

// Deletes a progressQuest from the DB.
exports.destroy = function(req, res) {
  Progressquest.findById(req.params.id, function (err, progressQuest) {
    if(err) { return handleError(res, err); }
    if(!progressQuest) { return res.send(404); }
    progressQuest.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}