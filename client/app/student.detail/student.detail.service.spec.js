/**
 * Created by park1369 on 2/25/16.
 */

'use strict';

describe('Service: studentDetails', function () {

  // load the service's module
  beforeEach(module('3601S16Lab5JsonDataProcessingApp'));

  // instantiate service
  var student;
  beforeEach(inject(function (_student_) {
    student = _student_;
  }));

  it('should do something', function () {
    expect(!!student).toBe(true);
  });

});
