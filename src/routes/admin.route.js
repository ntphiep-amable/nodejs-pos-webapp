const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/admin.controller');
const productsController = require('../app/controllers/products.controller');
// file upload config
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/images/pdThumbs');
    },
    filename: function(req, file, cb) {
        cb(null, `${req.body.pcode || "newImg"}.png`); // if the extension is not png, it will be converted to png
    }
});
const storageAvt = multer.diskStorage({
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
const uploadAvt = multer({
    storage: storageAvt,
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
const checkAdmin = (req, res, next) => {
    // if path for set up account, then skip this middleware
    if (req.path == "/extra/c") {
        next();
        return;
    }
    console.log(req.session.role);
    if (!req.session.role) {
        res.status(401).redirect('/login');
    } else
        if (req.session.role == "admin") {
            next();
        } else {
            res.status(403).json({
                status: false,
                message: "Access Forbidden"
            });
            // or return an 403 error, which will be handled by the error handler middleware, which status code will be 403
        }
}

router.use(checkAdmin);

// [GET] /admin
router.get('/', adminController.index);

// [POST] /admin
router.post('/', adminController.addEmpl);

// [GET] /admin/extra/:c
router.get('/extra/:c', adminController.extra);

// [GET] /admin/products

router.get('/products', productsController.index);

// [POST] /admin/products
router.post('/products', upload.single("imagePrd"), handleFileUploadError, productsController.addPrd);


// [GET] /admin/stat
router.get('/stat', adminController.stat);

// [POST] /admin/stat
router.post('/stat', adminController.chooseStat);

// [GET] /admin/stat/{email}
router.get('/stat/:email', adminController.statEmpl);

// [POST] /admin/stat/{email}
router.post('/stat/:email', adminController.chooseStatEmpl);

// [GET] /admin/e/:m
router.get('/e', adminController.detailEmpl);

// [GET] /admin/p/update
router.get('/p/update', adminController.passUpdate);

// [POST] /admin/p/update
router.post('/p/update', upload.none(), adminController.passC);

// [POST] /admin/l/employee
router.post('/l/employee', adminController.lockEmpl)

// [POST] /admin/send/employee
router.post('/send/employee', adminController.sendMail);

// [GET] /admin/account
router.get('/account', adminController.account);
// [GET] /admin/account/:email
router.get('/account/:email', adminController.detailAccount);

// [POST] /admin/changeAvatar
router.post('/changeAvatar', upload.single("avatar"), handleFileUploadError, adminController.changeAvatar);



router.get('/products/update', productsController.getUpdate);


router.post('/products/update/e', productsController.thisPrd);


router.post('/products/update', upload.single("imagePrd"), handleFileUploadError, productsController.postUpdate);



router.delete('/products/del/:id', productsController.delPrd);

module.exports = router;