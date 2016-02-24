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

      this.getGPA = function () {
        $scope.students = Student.query({id: 'getGPA'});

      };

      this.studentDetails = function () {
        $scope.students = Student.query({id: 'studentDetails'});
      };






      this.getCreditsValue = function () {
        var completedCredits = 0;
        for (var i = 0; i < Student.length; i++) {
          var courses = Student[i].courses;
          completedCredits[i] = {key: Student[i].id, val: 0};
          for (var j = 0; j < courses.length; j++) {
            if (courses[j].grade == "F") {
            } else {
              completedCredits[i].val += courses[j].course.credits;
            }
          }
        }
        $scope.students = completedCredits;
      };

     // $scope.credits = getCreditsValue();


    });


/*
    .controller('CreditCtrl', function ($scope, Student) {
          $scope.data = [{fruit: 'banana'},{fruit: 'tomato'}];

        function getCreditsValue(){
          var completedCredits = 0;
          for (var i = 0; i < Student.length; i++) {
            var courses = Student[i].courses;
            completedCredits[i] = {key: Student[i].id, val: 0};
            for (var j = 0; j < courses.length; j++) {
              if (courses[j].grade == "F") {
              } else {
                completedCredits[i].val += courses[j].course.credits;
              }
            }
          }
          return completedCredits;
        }

      //this.credits = function(){
        $scope.students = getCreditsValue()
      }
    });

*/










