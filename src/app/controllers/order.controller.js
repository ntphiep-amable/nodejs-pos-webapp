const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model")


class OrderController {
    // [GET] /employee/checkout
    index = async (req, res) => {
        
        res.render('pages/employee.order.hbs');
    };


    // [POST] /admin/products
    
}


module.exports = new OrderController();