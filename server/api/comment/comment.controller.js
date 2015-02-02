'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');
var Quest = require('../quest/quest.model');

// Get list of comments
exports.index = function(req, res) {
  Comment.find(function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};

// Get a single comment
exports.show = function(req, res) {
  Comment.find({ quest : req.params.id}, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    return res.json(comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  //req timeline quest/ user/ quest pool/ comment
  //needs = user : comment user / content : comment / quest : comment quest

  console.log(req.body.addTargetComment.content);
  Comment.create({content : req.body.addTargetComment.content, user : req.body.user._id, quest : req.body._id }, function(err, comment) {
    if(err) { return handleError(res, err); }
    getComment(comment, res);
   // return res.json(201, comment);
    Quest.findOne({_id : req.body._id}, function(err, quest){
      var comments = quest.comments;
      comments.unshift(comment._id);
      quest.save(function(err){
        console.log(err);
      });
    });
  });
};

var getComment = function(comment, res){
  Comment.findById(comment).populate('quest').populate('user').exec(function(err, comments){
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    var updated = _.merge(comment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    comment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
