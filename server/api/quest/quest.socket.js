/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Quest = require('./quest.model');

exports.register = function(socket) {
  Quest.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Quest.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('quest:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('quest:remove', doc);
}