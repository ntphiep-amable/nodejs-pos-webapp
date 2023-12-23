const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model")
const customerModel = require("../models/customers.model");


class CheckoutController {
    // [GET] /employee/checkout
    index = async (req, res) => {
        const orderId = req.query.id;
        if (!orderId) {
            return res.status(401).json({
                status: false,
                message: "You must login to use this feature",
                data: { },
            });
        }
        const orderCheck = await orderModel.findOne({ _id: orderId });
        if (!orderCheck) {
            return res.status(401).json({
                status: false,
                message: "Order not found",
                data: { },
            });
        }
        let orderCheckObj = orderCheck.toObject();

        const totalAll = orderCheckObj.totalAll;

        const productList = orderCheck.products.toObject();


        res.render('pages/employee.checkout.hbs', { productList: productList, totalAll: totalAll, navActive: 'order', username: req.session.user.fullname });
    };


    // [POST] /employee/checkout
    findCtm = async (req, res) => {
        const phoneNum = req.body.phoneNum;

        const customerCheck = await customerModel.findOne({ phoneNumber: phoneNum });
        
        
        
        
        if (!customerCheck) {
            return res.json({
                status: false,
                message: "Customer not found",
                data: {},
            }); 
        } else {
            const customerId = customerCheck.id;
            const fullname = customerCheck.fullname;
            const address = customerCheck.address;

            return res.json({
                status: true,
                message: "",
                data: { fullname, address, phoneNum, ctmId: customerId },
            });
        }
    };
    chooseCtm = async (req, res) => {
        const { ctmId, orId } = req.body;
        let orderCheck = await orderModel.findOne({ _id: orId });
        let customer = await customerModel.findOne({ _id: ctmId });
        if (!customer) {
            return res.json({
                status: false,
                message: "Customer not found",
                data: {},
            });
        } else {
            orderCheck.customerId = customer;
            orderCheck.save();
            return res.json({
                status: true,
                message: "Choose customer successfully",
                data: { orId, cmtName: customer.fullname },
            });
        }
        // customerModel.findOne({ _id: ctmId }).then((customer) => {
        //     orderCheck.customerId = customer;
        //     orderCheck.save();
        // });

        // return res.json({
        //     status: true,
        //     message: "Choose customer successfully",
        //     data: { orId, cmtName: customer.fullname },
        // });
    }

    // [GET] /employee/checkout/bill-{id}
    bill = async (req, res) => {
        const orderId = req.params.id;
        const orderCheck = await orderModel.findOne({ _id: orderId });
        if (!orderCheck) {
            return res.status(401).json({
                status: false,
                message: "Order not found",
                data: { },
            });
        }
        let orderCheckObj = orderCheck.toObject();
        let ownerCtm = await customerModel.findOne({ _id: orderCheck.customerId });
        let ctm = {};
        if (ownerCtm) {
            ctm.fullname = ownerCtm.fullname;
            ctm.address = ownerCtm.address;
            ctm.phoneNum = ownerCtm.phoneNumber;
        } else {
            ctm.fullname = "Anonymous Customer";
            ctm.address = "Unknown";
            ctm.phoneNum = "Unknown";
        }
        let staff = {};
        staff.fullname = req.session.user.fullname;
        staff.email = req.session.user.email;
        const totalAll = orderCheckObj.totalAll;
        const productList = orderCheck.products.toObject();
        const orderDate = orderCheckObj.orderDate;
        res.render('pages/employee.bill.hbs', { productList: productList, totalAll: totalAll, navActive: 'order', ctm, staff, orderDate });
    }


    addCus = async (req, res) => {
        const { orId, fullname, address, phoneNum } = req.body;
        let orderCheck = await orderModel.findOne({ _id: orId });
        
        let ctm = await customerModel.create({
            fullname: fullname,
            address: address,
            phoneNumber: phoneNum,
        });
        orderModel.updateOne({ _id: orId }, { customerId: ctm._id });
        let ctmId = ctm._id;
        return res.json({
            status: true,
            message: "Add customer successfully",
            data: { fullname, address, phoneNum, ctmId },
        });

    }
}


module.exports = new CheckoutController();