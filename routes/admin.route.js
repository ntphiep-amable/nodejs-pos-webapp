const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/admin.controller')



// [GET]  /admin/
router.get('/', adminController.index);


// [GET] /admin/login
router.get('/login', adminController.login);


// [POST] /admin/login
router.post('/login', adminController.check)
 





module.exports = router;
