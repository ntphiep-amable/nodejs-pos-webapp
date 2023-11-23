const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model")
const customerModel = require("../models/customers.model");


class OrderController {
    // [GET] /employee/order
    index = async (req, res) => {
        res.render('pages/employee.order.hbs');
    };


    // [POST] /employee/order
    
    
}


module.exports = new OrderController();