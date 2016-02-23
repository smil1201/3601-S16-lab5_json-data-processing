'use strict';

angular.module('3601S16Lab5JsonDataProcessingApp')
  .controller('StudentCtrl', function ($scope, Student) {

    $scope.students = Student.query();

    this.getABC = function () {
      $scope.students = Student.query({id: 'getABC'});
    };
    this.getFirstABC = function () {
      $scope.students = Student.query({id: 'getFirstABC'});
    };

    this.getDOB = function () {
      $scope.students = Student.query({id: 'getDOB'});

    };

    this.getMajors = function () {
      $scope.students = Student.query({id: 'getMajors'});

    };

    this.getCredits = function () {
      $scope.students = Student.query({id: 'getCredits'});

    };

  });
