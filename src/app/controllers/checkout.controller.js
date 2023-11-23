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
        // console.log(phoneNum);

        const customerCheck = await customerModel.findOne({ phoneNumber: phoneNum });
        const customerId = customerCheck.id;

        const thisOrder = await orderModel.findOne({ customerId: customerId });
        const productList = thisOrder.products;
        console.log(thisOrder.products[0]);
        
        if (!customerCheck) {
            return res.json({
                status: false,
                message: "k tim thay khach hang nay",
                data: {},
            });
        } else {
            const fullname = customerCheck.fullname;
            const address = customerCheck.address;

            return res.json({
                status: true,
                message: "ok man",
                data: { fullname, address, phoneNum, productList },
            });
        }
    };


    addCus = async (req, res) => {
        const { fullname, address, phoneNum } = req.body;
        // console.log(req.body);
        
        customerModel.create({
            fullname: fullname,
            address: address,
            phoneNumber: phoneNum,
        });

        return res.json({
            status: true,
            message: "them khach hang thanh cong",
            data: { fullname, address, phoneNum },
        });

    }
}


module.exports = new CheckoutController();