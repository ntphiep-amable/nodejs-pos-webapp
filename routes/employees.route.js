const express = require('express');
const router = express.Router();
const employeessController = require('../app/controllers/employees.controller');


router.get('/', employeessController.index);
router.post('/', employeessController.add)



module.exports = router;
