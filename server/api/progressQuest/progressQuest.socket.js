/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Progressquest = require('./progressQuest.model');

exports.register = function(socket) {
  Progressquest.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Progressquest.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('progressQuest:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('progressQuest:remove', doc);
}