const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model")
const customerModel = require("../models/customers.model");


class CheckoutController {
    // [GET] /employee/checkout
    index = async (req, res) => {
        const orderId = req.query.id;
        
        const orderCheck = await orderModel.findOne({ _id: orderId });
        let orderCheckObj = orderCheck.toObject();

        // console.log(orderCheck);
        const totalAll = orderCheckObj.totalAll;

        const productList = orderCheck.products.toObject();


        res.render('pages/employee.checkout.hbs', { productList: productList, totalAll: totalAll, orderId: orderId });
    };


    // [POST] /employee/checkout
    findCtm = async (req, res) => {
        const phoneNum = req.body.phoneNum;
        console.log(req.query);

        const customerCheck = await customerModel.findOne({ phoneNumber: phoneNum });
        

        if (!customerCheck) {
            return res.json({
                status: false,
                message: "k tim thay khach hang nay",
                data: {},
            }); 

        } else {
            const customerId = customerCheck.id;
            // const thisOrders = await orderModel.find({ customerId: customerId });
            

            // const productList = thisOrder.products;
            // console.log(thisOrder.products[0]);

            const fullname = customerCheck.fullname;
            const address = customerCheck.address;

            return res.json({
                status: true,
                message: "ok man",
                data: { fullname, address, phoneNum, customerId},
            });
        }
    };

    // /employee/checkout/add
    addCus = async (req, res) => {
        const { fullname, address, phoneNum, orderId } = req.body;

        const newCustomer = new customerModel({ fullname, address, phoneNumber: phoneNum });
        console.log(orderId);

        try {
            await newCustomer.save();
            const customerId = newCustomer._id;

            // await orderModel.updateOne({ _id: orderId }, { customerId: customerId });
            return res.json({
                status: true,
                message: "them khach hang thanh cong",
                data: { customerId },
            });

        } catch (error) {
            console.log(error);
        }



        
    }






    // [POST] /employee/checkout/confirm
    confirmOrd = async (req, res) => {
        const { orderId, customerId } = req.body;
        console.log(req.body);

        try {
            await orderModel.updateOne({ _id: orderId }, { customerId: customerId });
            return res.json({
                status: true,
                message: "thanh toan thanh cong",
                data: {},
            });

        } catch (error) {
            console.log(error);
        }
    };
}


module.exports = new CheckoutController();