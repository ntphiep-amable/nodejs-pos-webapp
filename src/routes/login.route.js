const express = require('express');
const router = express.Router();
const loginController = require('../app/controllers/login.controller');


// [GET] /login
router.get('/', loginController.index);

// [POST] /login
router.post('/', loginController.check);

// [DELETE] /login
router.delete('/', loginController.logout);


module.exports = router;