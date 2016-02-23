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

 exports.getMajor = function(req, res) {
   Student.find({}, null, {skip: 0, limit:30, sort:{major1: 1}},  function (err, students) {
     if (err) {
       console.log("Error getting data from database");
       res.send(err)
     } else {
       res.json(students); // return results
     }
   });
};
