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

/*
exports.getFullName = function(req, res){
  Student.find({}, null, {skip:0, limit:0, sort:{firstName: 1, lastName: 1}}, function(err, students){
    if(err) {
      console.log("Error getting data from database");
      res.send(err)
    } else{
      res.json(students);
    }
  });
};
*/


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

/*
var getFullName = function(students) {
  var myName = [];
  for(var i = 0; i < students.length; i++){
    myName = students[i].getStudentDetails();
  }
  return myName;
};*/

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
getFirstABC
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
          sortedData[i] = data[j];
        }
      }
    }
    res.json(sortedData);
  });
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
