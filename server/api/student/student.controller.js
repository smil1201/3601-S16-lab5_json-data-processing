/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  update
 * DELETE  /api/students/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Student from './student.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Students
export function index(req, res) {
  Student.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Student from the DB
export function show(req, res) {
  Student.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Student in the DB
export function create(req, res) {
  Student.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Student in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Student.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Student from the DB
export function destroy(req, res) {
  Student.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//our functions



//sorts alphabetically by last name
exports.getABC = function(req, res) {
  Student.find({}, null, {skip: 0, limit:30, sort:{lastName: 1}},  function (err, students) {
    if (err) {
      console.log("Error getting data from database");
      res.send(err)
    } else {
      res.json(students); // return results
    }
  });
};

//sorts alphabetically by first name
exports.getFirstABC = function(req, res) {
  Student.find({}, null, {skip: 0, limit:30, sort:{firstName: 1}},  function (err, students) {
    if (err) {
      console.log("Error getting data from database");
      res.send(err)
    } else {
      res.json(students); // return results
    }
  });
};


//sorts by date of birth
exports.getDOB = function(req, res) {
  Student.find({}, null, {skip: 0, limit:0, sort:{dateOfBirth: 1}},  function (err, students) {
    if (err) {
      console.log("Error getting dob from database");
      res.send(err)
    } else {
      res.json(students); // return results
    }
  });
};

//sorts by primary major
exports.getMajors = function(req, res) {
  Student.find({}, null, {skip: 0, limit:0, sort:{major1: 1, major2:1}},  function (err, students) {
    if (err) {
      console.log("Error getting majors from database");
      res.send(err)
    } else {
      res.json(students); // return results
    }
  });
};

exports.findStudentByCourse = function(req, res) {
  Student.find({'courses.course.name': req.query['courseName']}, null, {skip: 0, limit:30, sort:{}}, function (err, student) {
    if (err) {
      res.send(err)
    } else {
      res.json(student); // return results
    }
  });
};


//helper function to calculate credit number
var getCreditsValue = function(students) {
  var completedCredits = [];
  for (var i = 0; i < students.length; i++) {
    var courses = students[i].courses;
    completedCredits[i] = {key: students[i].id, val: 0};
    for (var j = 0; j < courses.length; j++) {
      if (courses[j].grade === "F") {
      }
      else if (courses[j].grade === "IP") {
      }else {
        completedCredits[i].val += courses[j].course.credits;
      }
    }
  }
  return completedCredits;
};

//complicated but working completed credit sort
exports.getCredits = function(req, res) {
  var sortedData = [];
  Student.find({}, function(err, data) {
    var courseValue = getCreditsValue(data);
    var sorted = courseValue.slice(0).sort(function(a,b) {
      return a.val - b.val;
    });

    for(var i = 0; i < sorted.length; i++) {
      for(var j = 0; j < data.length; j++) {
        if(sorted[i].key == data[j].id) {
          sortedData[i] = {};

          //sortedData[i] = data[j];
          sortedData[i]['firstName'] = data[j]['firstName'];
          sortedData[i]['lastName'] = data[j]['lastName'];
          sortedData[i]['courses'] = data[j]['courses'];
          sortedData[i]['dateOfBirth'] = data[j]['dateOfBirth'];
          sortedData[i]['gender'] = data[j]['gender'];
          sortedData[i]['email'] = data[j]['email'];
          sortedData[i]['phone'] = data[j]['phone'];
          sortedData[i]['address'] = data[j]['address'];
          sortedData[i]['major1'] = data[j]['major1'];
          sortedData[i]['major2'] = data[j]['major2'];
          sortedData[i]['creds'] = sorted[i].val;
        }
      }
    }
    res.json(sortedData);
  });
};


var getStuTotCred = function(student) {
  var totalCredits = 0;
    for (var j = 0; j < student.courses.length; j++) {
      if (student.courses[j].grade === "IP") {
      } else {
        totalCredits += parseInt(student.courses[j].course.credits);
      }
    }
  return totalCredits;
};

var getStuCourseCred = function(student) {
  var credits = [];
  for (var j = 0; j < student.courses.length; j++) {
    if (student.courses[j].grade === "IP") {
      credits[j] = 0
    } else {
      credits[j] = student.courses[j].course.credits;
    }
  }
  return credits;
};

var studentGradePoints = function(student) {
  var grade = [];
  for (var j = 0; j < student.courses.length; j++) {
    if (student.courses[j].grade === "F") {
      grade[j] = 0.00;
    }
    else if (student.courses[j].grade === "D") {
      grade[j] = 1.00;
    }
    else if (student.courses[j].grade === "C") {
      grade[j] = 2.00;
    }
    else if (student.courses[j].grade === "B") {
      grade[j] = 3.00;
    }
    else if (student.courses[j].grade === "A") {
      grade[j] = 4.00;
    }
    else {
      grade[j] = 0.00;
    }
  }
  return grade;
};

var getStudentGPA = function(student){
  var totalCredits = [];
  var totalGradePoints = [];
  var credits = [];
  var studentGPA = 0;
  var gradePoints = 0;
  credits = getStuCourseCred(student);
  totalCredits = getStuTotCred(student);
  totalGradePoints = studentGradePoints(student);
  for(var i=0; i<credits.length; i++){
    gradePoints += parseInt(credits[i]) * parseInt(totalGradePoints[i])
  }
  studentGPA = (gradePoints/totalCredits);
  return parseFloat(studentGPA.toFixed(2))
};

exports.getAllStuGPA = function(reg, res) {
  var studentGPA = [];
  var GPAAdded = [];
  Student.find({}, null, {skip: 0, limit:30, sort:{lastName: 1}},  function (err, data) {
    var courseValue = getCreditsValue(data);
    for (var i = 0; i < data.length; i++) {
      studentGPA[i] = {key: data[i].id, val: 0};
      studentGPA[i].val += getStudentGPA(data[i]);
      GPAAdded[i] = {};
      GPAAdded[i]['firstName'] = data[i]['firstName'];
      GPAAdded[i]['lastName'] = data[i]['lastName'];
      GPAAdded[i]['courses'] = data[i]['courses'];
      GPAAdded[i]['dateOfBirth'] = data[i]['dateOfBirth'];
      GPAAdded[i]['gender'] = data[i]['gender'];
      GPAAdded[i]['email'] = data[i]['email'];
      GPAAdded[i]['phone'] = data[i]['phone'];
      GPAAdded[i]['address'] = data[i]['address'];
      GPAAdded[i]['major1'] = data[i]['major1'];
      GPAAdded[i]['major2'] = data[i]['major2'];
      GPAAdded[i]['creds'] = courseValue[i].val;
      GPAAdded[i]['GPA'] = studentGPA[i].val;

      }
  res.json(GPAAdded);
});
};

var studentRank = function(student){
  var credits = getStuCourseCred(student);
  var completedCredits = 0;
  for(var i =0; i < credits.length; i++){
    completedCredits += parseInt(credits[i]);
  }
  var studentClass = "";
  if(completedCredits < 30){
    studentClass = "Freshman";
  }
  else if(completedCredits >= 30 && completedCredits < 60){
    studentClass = "Sophomore";
  }
  else if(completedCredits >= 60 && completedCredits < 90){
    studentClass = "Junior";
  }
  else{
    studentClass = "Senior"
  }
  return studentClass;
};

exports.getStudentRank = function(reg, res){
  var studentClass = [];
  var rankAdded = [];
  var studentGPA = [];

  Student.find({},  function (err, data) {
    var courseValue = getTotalCredits(data);
    for (var i = 0; i < data.length; i++) {
      studentClass[i] = {val: ""};
      studentClass[i].val = studentRank(data[i]);
      studentGPA[i] = {key: data[i].id, val: 0};
      studentGPA[i].val += getStudentGPA(data[i]);
      rankAdded[i] = {};
      rankAdded[i]['firstName'] = data[i]['firstName'];
      rankAdded[i]['lastName'] = data[i]['lastName'];
      rankAdded[i]['courses'] = data[i]['courses'];
      rankAdded[i]['dateOfBirth'] = data[i]['dateOfBirth'];
      rankAdded[i]['gender'] = data[i]['gender'];
      rankAdded[i]['email'] = data[i]['email'];
      rankAdded[i]['phone'] = data[i]['phone'];
      rankAdded[i]['address'] = data[i]['address'];
      rankAdded[i]['major1'] = data[i]['major1'];
      rankAdded[i]['major2'] = data[i]['major2'];
      rankAdded[i]['creds'] = courseValue[i].val;
      rankAdded[i]['rank'] = studentClass[i].val;
      rankAdded[i]['GPA'] = studentGPA[i].val

    }
    res.json(rankAdded);
  });
};


var getTotalCredits = function(students) {
  var completedCredits = [];
  for (var i = 0; i < students.length; i++) {
    var courses = students[i].courses;
    completedCredits[i] = {key: students[i].id, val: 0};
    for (var j = 0; j < courses.length; j++) {
      if (courses[j].grade == "IP") {
      }else {
        completedCredits[i].val += courses[j].course.credits;
      }
    }
  }
  return completedCredits;
};



