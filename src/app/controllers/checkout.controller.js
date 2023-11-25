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


        res.render('pages/employee.checkout.hbs', { productList: productList, totalAll: totalAll });
    };


    // [POST] /employee/checkout
    findCtm = async (req, res) => {
        const phoneNum = req.body.phoneNum;
        // console.log(phoneNum);

        const customerCheck = await customerModel.findOne({ phoneNumber: phoneNum });
        

        
        
        if (!customerCheck) {
            return res.json({
                status: false,
                message: "k tim thay khach hang nay",
                data: {},
            }); 
        } else {
            const customerId = customerCheck.id;
            const thisOrder = await orderModel.findOne({ customerId: customerId });
            const productList = thisOrder.products;
            console.log(thisOrder.products[0]);

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