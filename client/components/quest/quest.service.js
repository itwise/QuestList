'use strict';

angular.module('questApp')
  .factory('Quest', function($resource) {
    return $resource('/api/quests/:id.json', {
        id: '@_id'
      },
      {
        getQuestList: {
          url: '/api/quests',
          method : 'GET',
          isArray : true
        },
        createQuest : {
          url : '/api/quests',
          method : 'POST'
        },
        updateQuest : {
          url : '/api/quests/:id',
          method : 'PUT'
        },
        deleteQuest : {
          url : 'api/quests/:id',
          method : 'DELETE'
        }
      }
    );
  });
