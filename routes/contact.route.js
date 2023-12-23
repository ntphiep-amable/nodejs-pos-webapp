const express = require('express');
const router = express.Router();
const contactController = require('../src/app/controllers/contact.controller');

// [GET]  /products/
router.get('/', contactController.index);

module.exports = router;
