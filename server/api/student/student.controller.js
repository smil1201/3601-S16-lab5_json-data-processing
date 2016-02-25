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


//student details in progress
/*
exports.studentDetails = function(req, res, student) {
  var details = Student.findById(student)

  Student.find({}, function(err, data) {
    var courseValue = getCreditsValue(data);


  Student.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
};
*/


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



exports.studentDetails = function(req, res) {
  res.json(students[i].firstName);
 /*
  var output = "";
  for (var i=0; i < student.length; i++){
    if (err) {
      console.log("Error getting majors from database");
      res.send(err)
    } else {
      res.json(students[i].firstName); // return results
    }
    }
  }*/
};

 /* Student.find({}, null, null, {skip:0, limit:0}, function(err, students) {
  if (err) {
    console.log("Error finding the student details");
    res.send(err)
  } else {
    res.json(Student.findByIdAsync);
  }
});
}
*/


//helper function to calculate credit number
var getCreditsValue = function(students) {
  var completedCredits = [];
  for (var i = 0; i < students.length; i++) {
    var courses = students[i].courses;
    completedCredits[i] = {key: students[i].id, val: 0};
    for (var j = 0; j < courses.length; j++) {
      if (courses[j].grade == "F") {
      } else {
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

//what sort by completed credits should sort
/*{ key: 'Kristi', val: 44 },
 { key: 'Baldwin', val: 49 },
 { key: 'Kathy', val: 50 },
 { key: 'Love', val: 55 },
 { key: 'Hahn', val: 55 },
 { key: 'Ferrell', val: 56 },
 { key: 'Hilary', val: 57 },
 { key: 'Ethel', val: 59 },
 { key: 'Parks', val: 62 },
 { key: 'Barron', val: 63 } ]
 */







var getTotalCredits = function(students) {
  var totalCredits = [];
  for (var i = 0; i < students.length; i++) {
    var courses = students[i].courses;
    totalCredits[i] = {key: students[i].id, val: 0};
    for (var j = 0; j < courses.length; j++) {
        totalCredits[i].val += courses[j].course.credits;
    }
  }
  return totalCredits;
};

//helper function to calculate credit number
var getGPAValue = function(students) {
  var credits = [];
  var grade = [];
  var gradePoints = [];
  for (var i = 0; i < students.length; i++) {
    var courses = students[i].courses;
    credits[i] = {key: students[i].id, val: 0};
    for (var j = 0; j < courses.length; j++) {
      if (courses[j].grade == "F") {
        grade[j] = 0.00
      }
      else if (courses[j].grade == "D") {
        grade[j] = 1.00
      }
      else if (courses[j].grade == "C") {
        grade[j] = 2.00
      }
      else if (courses[j].grade == "B") {
        grade[j] = 3.00
      }
      else if (courses[j].grade == "A") {
        grade[j] = 4.00
      }
    }
  }
  for (var k = 0; k < courses.length; k++) {
          credits[i].val += courses[j].course.credits;
      }



  return completedCredits;

};

//complicated but working completed credit sort
exports.getGPA = function(req, res) {
  var sortedData = [];
  Student.find({}, function(err, data) {
    var courseValue = getCreditsValue(data);
    var sorted = courseValue.slice(0).sort(function(a,b) {
      return a.val - b.val;
    });

    for(var i = 0; i < sorted.length; i++) {
      for(var j = 0; j < data.length; j++) {
        if(sorted[i].key == data[j].id) {
          sortedData[i] = data[j];
        }
      }
    }
    res.json(sortedData);
  });
};


var calculator = function(dataArray) {
  if (dataArray.length >= 1) {
    var i;
    var gpa = 0;
    var totalCreditscreds = 0;
    for (i = 0; i < dataArray.length; i++) {
      if(self.gradeConversion(dataArray[i].grade) == "ERROR Enter a real grade."){
        return "ERROR Enter a real grade and remove non-real grade.";
      }
      gpa += self.gradeConversion(dataArray[i].grade) *parseInt(dataArray[i].credit);
     // totalCredits += parseInt(dataArray[i].credit);
    }
    return (gpa/totalCredits).toFixed(2);
  }
  else {
    return ""
  }
};











/*

  var detailedData = [];
  Student.find({}, function(err, data) {
    var studentName = getFullName(data);
    var myName =
  })
};*/

//what sort by completed credits should sort
/*{ key: 'Kristi', val: 44 },
{ key: 'Baldwin', val: 49 },
{ key: 'Kathy', val: 50 },
{ key: 'Love', val: 55 },
{ key: 'Hahn', val: 55 },
{ key: 'Ferrell', val: 56 },
{ key: 'Hilary', val: 57 },
{ key: 'Ethel', val: 59 },
{ key: 'Parks', val: 62 },
{ key: 'Barron', val: 63 } ]
*/
