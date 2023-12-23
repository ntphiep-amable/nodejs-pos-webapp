const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model");
const customerModel = require("../models/customers.model");


class OrderController {
    // :)))))
    


    // [GET] /employee/order
    index = async (req, res) => {
        res.render('pages/employee.order.hbs', { navActive: 'order', username: req.session.user.fullname });
    };


    // [POST] /employee/order
    findPrd = async (req, res) => {
        const keyword = req.body.keyword;
        // console.log(keyword); // find product by barcode or name
        const products1 = await productModel.find({ barcode: { $regex: new RegExp(keyword, 'i') } });
        const products2 = await productModel.find({ name: { $regex: new RegExp(keyword, 'i') } });
        const products = [...products1, ...products2];

        if (products.length > 0) {

            return res.json({
                status: true,
                message: "Product list",
                data: { products },
            });
        } else {
            return res.json({
                status: false,
                message: "Product not found",
                data: { },
            });
        }
    }
    

    // [POST] /employee/order/create
    createOrder = async (req, res) => {
        const { productsData, totalAll } = req.body;
        
        const salesperson = req.session.user;
        if (!salesperson) {
            return res.status(401).json({
                status: false,
                message: "You must login to use this feature",
                data: { },
            });
        }
        const newOrder = new orderModel({
            customerId: null,
            products: productsData,
            totalAll: totalAll,
            createdBy: salesperson._id,
        });
        try {
            await newOrder.save();
            const orderId = newOrder._id;
            for (const product of productsData) {
                const { productId, productName } = product;
                const productInDb = await productModel.findOne({ _id: productId });
                if (!productInDb) {
                    return res.status(400).json({
                        status: false,
                        message: `Product ${productName} not found`,
                        data: { },
                    });
                } else {
                    productInDb.beenPurchased = true;
                    await productInDb.save();
                }
            }
            return res.json({
                status: true,
                message: "Create order successfully",
                data: { orderId },
            });
        } catch (error) {
            console.log(error);
        }
    }
    // [GET] /employee/customer/history/:phone
    history = async (req, res) => {
        const phone = req.params.phone;
        const customer = await customerModel.findOne({ phoneNumber: phone });
        if (!customer) {
            return res.status(400).json({
                // status: false,
                message: "Customer not found",
                // data: { },
            });
        }
        const ordersH = await orderModel.find({ customerId: customer._id });
        const orders = ordersH.map(order => order.toObject());
        return res.render('pages/products.update.hbs', { navActive: 'customers', customer: customer.toObject(), orders });
    }
}


module.exports = new OrderController();