const express = require('express');
const router = express.Router();
const registerController = require('../app/controllers/register.controller')

// [GET]  /register/
router.get('/', registerController.index);
router.post('/', registerController.save);

module.exports = router;
