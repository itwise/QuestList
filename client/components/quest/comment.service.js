/**
 * Created by sypark on 15. 1. 28.
 */
'use strict';

angular.module('questApp')
  .factory('Comment', function($resource){

    return $resource('/api/comments/:id.json', {
      id : '@_id'
    },
      {
        createComment : {
          url : '/api/comments',
          method : 'POST'
        },
        updateComment : {
          url : '/api/comments/:id',
          method : 'PUT'
        },
        deleteComment : {
          url : '/api/comments/:id',
          method : 'DELETE'
        }
      }
    );

  });
