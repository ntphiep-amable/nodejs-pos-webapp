const express = require('express');
const router = express.Router();
const loginController = require('../app/controllers/login.controller');


// [GET] /login
router.get('/', loginController.index);

// [POST] /login
router.post('/', loginController.check);


module.exports = router;