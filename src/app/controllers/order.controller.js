const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model");
const cartModel = require("../models/carts.model");
const customerModel = require("../models/customers.model");


class OrderController {
    // [GET] /employee/order
    index = async (req, res) => {
        res.render('pages/employee.order.hbs');
    };


    // [POST] /employee/order
    findPrd = async (req, res) => {
        const keyword = req.body.keyword;
        // console.log(keyword);

        const products = await productModel.find({ name: { $regex: new RegExp(keyword, 'i') } });

        if (products.length > 0) {
            // products.forEach(element => {
                
            // });


            return res.json({
                status: true,
                message: "cac san pham",
                data: { products },
            });
        } else {
            console.log("khong thay san pham");
        }
    }
    
}


module.exports = new OrderController();