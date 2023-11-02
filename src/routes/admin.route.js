const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/admin.controller');

// [GET] /admin
router.get('/', adminController.index);

// [POST] /admin
router.post('/', adminController.addEmpl);

// [GET] /admin/extra/:c
router.get('/extra/:c', adminController.extra);

// [GET] /admin/products
router.get('/products', adminController.productList);

// [GET] /admin/stat
router.get('/stat', adminController.stat);

// [GET] /admin/e/:m
router.get('/e', adminController.detailEmpl);

// [GET] /admin/p/update
router.get('/p/update', adminController.passUpdate);

// [POST] /admin/p/update
router.post('/p/update', adminController.passC);

// [POST] /admin/l/employee
router.post('/l/employee', adminController.lockEmpl)

// [POST] /admin/send/employee
router.post('/send/employee', adminController.sendMail);

module.exports = router;