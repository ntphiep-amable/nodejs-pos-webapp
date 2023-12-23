const express = require('express');
const router = express.Router();
const employeesController = require('../app/controllers/employees.controller');

const checkoutController = require('../app/controllers/checkout.controller');
const orderController = require('../app/controllers/order.controller');

// file upload config
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/images/avatar');
    },
    filename: function(req, file, cb) {
        cb(null, `${req.session.user.email || "newImg"}.png`); // if the extension is not png, it will be converted to png
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = {
            message: "Wrong file type"
        }
        return cb(error, false);
    }
    cb(null, true);
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1 MB
    },
    fileFilter: fileFilter
});
const handleFileUploadError = (error, req, res, next) => {
    if (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

// forbidden if req.session.user.role != "admin"
const checkEmp = (req, res, next) => {
    if (req.path == "/set-password") {
        next();
        return;
    }
    if (!req.session.role) {
        res.status(401).redirect('/login');
    } else
        next();
}

router.use(checkEmp);

// [GET] /employee
router.get('/', employeesController.index);

// [POST] /employee
// router.post('/', employeesController.check);

// [GET] /employee/customers
router.get('/customers', employeesController.customers);

// [GET] /employee/account
router.get('/account', employeesController.account);

// [GET] /employee/stat
router.get('/stat', employeesController.viewStatistical);

// [POST] /employee/stat
router.post('/stat', employeesController.chooseStatistical);

// [POST] /employee/c
router.post('/c', employeesController.checkNew);

// [GET] /employee/p/update
router.get('/p/update', employeesController.passUpdate);

// [POST] /employee/changeAvatar
router.post('/changeAvatar', upload.single("avatar"), handleFileUploadError, employeesController.changeAvatar);


// [POST] /employee/p/update
router.post('/p/update', upload.none(), employeesController.passC);

// [POST] /employee/set-password
router.post('/set-password', employeesController.setPass);
// [GET] /employee/set-password
router.get('/set-password', employeesController.extra);


// [GET] /employee/avt/update
router.get('/avt/update', employeesController.avtUpdate);


// [POST] /employee/avt/update
router.post('/avt/update', employeesController.avtC)


router.get('/checkout', checkoutController.index);
router.post('/checkout', checkoutController.findCtm);
router.post('/checkout/add', checkoutController.addCus);
router.post('/checkout/choose', checkoutController.chooseCtm);
// [GET] /employee/checkout/bill-{id}
router.get('/checkout/bill-:id', checkoutController.bill);




router.get('/order', orderController.index);
router.post('/order/f', orderController.findPrd);
router.post('/order/create', orderController.createOrder);
router.get('/customer/history/:phone', orderController.history);



module.exports = router;