/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Questpool = require('./questPool.model');

exports.register = function(socket) {
  Questpool.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Questpool.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('questPool:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('questPool:remove', doc);
}