const express = require('express');
const router = express.Router();
const employeesController = require('../app/controllers/employees.controller');

// [GET] /employee
router.get('/', employeesController.index);

// [POST] /employee
// router.post('/', employeesController.check);


// [POST] /employee/c
router.post('/c', employeesController.checkNew);

// [GET] /employee/p/update
router.get('/p/update', employeesController.passUpdate);


// [POST] /employee/p/update
router.post('/p/update', employeesController.passC);

module.exports = router;