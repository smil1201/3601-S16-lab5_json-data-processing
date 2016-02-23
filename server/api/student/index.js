'use strict';

var express = require('express');
var controller = require('./student.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/getABC', controller.getABC);
router.get('/getDOB', controller.getDOB);
router.get('/getMajors', controller.getMajors);
router.get('/getCredits', controller.getCredits);


router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;
