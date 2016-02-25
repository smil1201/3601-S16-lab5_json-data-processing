'use strict';

angular.module('3601S16Lab5JsonDataProcessingApp')
  .controller('StudentDetailCtrl', function ($scope, $stateParams, Student) {
    $scope.student = Student.get({ id: $stateParams.id });

    this.studentDetails = function () {
      var output = "";
      for(var i = 0; i < student.length; i++){
        output[i] = Student[i].firstName + Student[i].lastName + Student[i].dateOfBirth + Student[i].gender + Student[i].email + Student[i].phone + Student[i].address;

      }
      $scope.students = output;
    };


  });

