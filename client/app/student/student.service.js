'use strict';

angular.module('studentManagerApp')
  .factory('Student', function($resource) {
    return $resource('/api/students/:id');
  });

angular.module('3601S16Lab5JsonDataProcessingApp')
  .factory('student', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
