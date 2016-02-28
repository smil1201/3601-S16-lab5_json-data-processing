'use strict';

  angular.module('3601S16Lab5JsonDataProcessingApp')
    .controller('StudentCtrl', function ($scope, Student) {

      $scope.students = Student.query();

      $scope.studentCourse = "BANANA";

      $scope.testing = function(){
        Student.query({course: 'banana'});
      };




      this.findStudentByCourse = function(){
        $scope.studentCourse = Student.query({id: 'findStudentByCourse'});
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

