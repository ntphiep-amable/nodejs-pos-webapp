const express = require('express');
const router = express.Router();
const employeesController = require('../app/controllers/employees.controller');
const checkoutController = require('../app/controllers/checkout.controller');
const orderController = require('../app/controllers/order.controller');



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




// [GET] /employee/avt/update
router.get('/avt/update', employeesController.avtUpdate);


// [POST] /employee/avt/update
router.post('/avt/update', employeesController.avtC)


router.get('/checkout', checkoutController.index);

router.post('/checkout', checkoutController.findCtm);


router.get('/order', orderController.index);
router.post('/order/f', orderController.findPrd);


router.post('/checkout/add', checkoutController.addCus);




module.exports = router;