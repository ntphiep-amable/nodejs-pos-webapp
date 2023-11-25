const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model");
const customerModel = require("../models/customers.model");


class OrderController {
    // :)))))
    


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

            return res.json({
                status: true,
                message: "cac san pham",
                data: { products },
            });
        } else {
            return res.json({
                status: false,
                message: "khong thay san pham",
                data: { },
            });
        }
    }
    

    // [POST] /employee/order/create
    createOrder = async (req, res) => {
        const { productsData, totalAll } = req.body;
        
        // console.log(productsData);

        const newOrder = new orderModel({
            customerId: "",
            products: productsData,
            totalAll: totalAll,
        });

        try {
            await newOrder.save();
            const orderId = newOrder._id;

            return res.json({
                status: true,
                message: "tao don hang thanh cong",
                data: { orderId },
            });
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new OrderController();