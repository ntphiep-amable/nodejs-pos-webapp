const express = require('express');
const router = express.Router();
const employeesController = require('../app/controllers/employees.controller');

// [GET] /employee
router.get('/', employeesController.index);

// [POST] /employee
// router.post('/', employeesController.check);


module.exports = router;