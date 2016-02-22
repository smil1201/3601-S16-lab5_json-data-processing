'use strict';

angular.module('3601S16Lab5JsonDataProcessingApp')
  .controller('StudentCtrl', function ($scope) {
    $scope.message = 'Hello';
  })
  .controller('StudentCtrl', function ($scope, Student) {
    $scope.students = Student.query();
  });
