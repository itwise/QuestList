'use strict';

angular
    .module('questApp')
    .factory('viewLoader', function(){
        var $ = window.jQuery;
        return {
            isLoaded: function(elExpression){
                return $(elExpression).size() === 1;
            },
            load: function(viewUrl, callback){
                $.get(viewUrl).done(function(html){
                    callback(html);
                });
            }
        };
    });
