'use strict';

  angular.module('3601S16Lab5JsonDataProcessingApp')
    .controller('StudentCtrl', function ($scope, Student) {


      $scope.students = Student.query();

      $scope.students2 = Student.query();


      this.findStudentByCourse = function(){
        Student.query({courseName: $scope.studentCourse, id: 'findStudentByCourse'}, function(student){
          $scope.students2 = student;
        });
      };

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


      this.getAllStuGPA = function () {
        $scope.students = Student.query({id: 'getAllStuGPA'});

      };

      this.getStudentRank = function () {
        $scope.students = Student.query({id: 'getStudentRank'});

      };

      $scope.expand = function(student){
        student.show = !student.show;
      };

      $scope.expandDetails = function(student){
        student.show = !student.show;
      };



    });

