const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model")
const customerModel = require("../models/customers.model");


class CheckoutController {
    // [GET] /employee/checkout
    index = async (req, res) => {
        res.render('pages/employee.checkout.hbs');
    };


    // [POST] /employee/checkout
    findCtm = async (req, res) => {
        const phoneNum = req.body.phoneNum;
        console.log(phoneNum);

        const customerCheck = await customerModel.findOne({ phoneNumber: phoneNum });
        
    };

}


module.exports = new CheckoutController();