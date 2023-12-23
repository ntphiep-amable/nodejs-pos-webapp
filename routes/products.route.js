const express = require('express');
const router = express.Router();
const productsController = require('../src/app/controllers/products.controller');

router.get('/:slug', productsController.show);
router.get('/', productsController.index);



module.exports = router;
