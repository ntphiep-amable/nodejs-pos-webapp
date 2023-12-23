const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');
const productModel = require("../models/products.model");
const customerModel = require("../models/customers.model");
const orderModel = require("../models/orders.model");


class EmployeesController {
    // [GET] /employee
    index = async (req, res) => {
        let productList = await productModel.find();
        let prds = productList.map(prd => {
            return prd.toObject();;
        });

        res.render('pages/employee.home.hbs', { productList: prds });  
    };

    // [POST] /employee
    handle = async (req, res) => {
        
    }

    // [GET] /customers
    customers = async (req, res) => {
        let customersList = await customerModel.find();
        let ctmList = customersList.map(ctm => {
            return ctm.toObject();;
        });
        res.render('pages/employee.customers.hbs', { ctmList: ctmList, navActive: 'customers' });
    }

    account = async (req, res) => {
        res.render('pages/account.hbs', { navActive: 'account', user: req.session.user });
    }

    // [GET] /employee/stat
    viewStatistical = async (req, res) => {
        // get all orders created from 0:00:00 to 23:59:59 today
        let orderList = await orderModel.find({ createdBy: req.session.user._id}).sort({ createdAt: -1 });
        let orders = await Promise.all(orderList.map(async order => {
            let ctm = await customerModel.findById(order.customerId);
            let ord = order.toObject();
            if (ctm) {
                ord.customerPhone = ctm.phoneNumber;
                ord.customerName = ctm.fullname;
            }
            return ord;
        }));
        let ordersToday = orders.filter(order => {
            let date = new Date(order.orderDate);
            let today = new Date();
            return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        });
        const sumaryOrders = (orders) => {
            return orders.reduce((sumary, order) => {
                    sumary.totalAmount += order.totalAll;
                    sumary.numberOfOrders += 1;
                    sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                return sumary;
            }, { totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0 });
        }
        let ordersYesterday = orders.filter(order => {
            let date = new Date(order.orderDate);
            let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
            return date.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0);
        });
        let ordersWithinLast7Days = orders.filter(order => {
            let date = new Date(order.orderDate);
            let today = new Date();
            return date.setHours(0,0,0,0) >= new Date(new Date().setDate(new Date().getDate()-7)).setHours(0,0,0,0) && date.setHours(0,0,0,0) <= today.setHours(0,0,0,0);
        });
        let ordersThisMonth = orders.filter(order => {
            let date = new Date(order.orderDate);
            let thisMonth = new Date().getMonth();
            return date.getMonth() === thisMonth;
        });
        // 3 fields: Total amount received, Number of orders, number of products sold
        let sumaryToday = sumaryOrders(ordersToday);
        let sumaryYesterday = sumaryOrders(ordersYesterday);
        let sumaryWithinLast7Days = sumaryOrders(ordersWithinLast7Days);
        let sumaryThisMonth = sumaryOrders(ordersThisMonth);
        res.render('pages/employee.stat.hbs', { orderList: orders, navActive: 'stat', 
                        ordersToday, sumaryToday, ordersYesterday, sumaryYesterday, 
                        ordersWithinLast7Days, sumaryWithinLast7Days, ordersThisMonth, sumaryThisMonth });
    };

    // [POST] /employee/stat
    chooseStatistical = async (req, res) => {
        let { from, to } = req.body;
        let orderList = await orderModel.find({ createdBy: req.session.user._id}).sort({ createdAt: -1 });
        let orders = await Promise.all(orderList.map(async order => {
            let ctm = await customerModel.findById(order.customerId);
            let ord = order.toObject();
            if (ctm) {
                ord.customerPhone = ctm.phoneNumber;
                ord.customerName = ctm.fullname;
            }
            return ord;
        }));
        let ordersInTime = orders.filter(order => {
            let date = new Date(order.orderDate);
            return date.setHours(0,0,0,0) >= new Date(from).setHours(0,0,0,0) && date.setHours(0,0,0,0) <= new Date(to).setHours(0,0,0,0);
        });
        const sumaryOrders = (orders) => {
            return orders.reduce((sumary, order) => {
                    sumary.totalAmount += order.totalAll;
                    sumary.numberOfOrders += 1;
                    sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                return sumary;
            }, { totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0 });
        }
        let sumaryInTime = sumaryOrders(ordersInTime);
        res.status(200).json({ ordersInTime, sumaryInTime });
    };


    // [POST] /employee/c
    checkNew = async (req, res) => {
        try {
            const data = req.body.username;

            const userCheck = await userModel.findOne({ username: req.body.username });
            if (!userCheck.isConfirmed) {
                return res.json({
                    status: false,
                    message: "Your account has not been set up yet! Please set up your account before using it's features",
                    data: { }
                }) 
            }

            else if (userCheck.isLocked) {
                return res.json({
                    status: false,
                    message: "Your account has been locked! If you have any questions, please contact the administrator",
                    data: { }
                })  
            }

            else {
                return res.json({
                    status: true,
                    message: "",
                    data: { }
                }) 
            }

        } catch (error) {
            console.log(error);
        }
        
    };


    // [GET] /employee/p/update
    passUpdate = async (req, res) => {
        res.render('pages/changePass.hbs', { navActive: 'account', username: req.session.user.username });
    }

    // [POST] /employee/set-password
    setPass = async (req, res) => {
        const { password, confirmPassword, tk } = req.body;
        const userCheck = await userModel.findOne({ token: tk });
        if (userCheck == null) {
            return res.status(404);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.updateOne({ _id: userCheck._id }, { password: hashedPassword }).then(() => {
            userModel.updateOne({ _id: userCheck._id }, { isConfirmed: true}).catch(err => console.log(err));
        });
        return res.redirect('/login');
    }

    // [GET] /employee/set-password
    extra = async (req, res) => {
        if (req.session.isValidate) {
            const token = req.session.token;
            req.session.isValidate = null;
            req.session.token = null;
            res.render('pages/extrapage.hbs', { tk: token });
        } else {
            // error 404
            res.status(404).redirect('/login');
        }
    }
    
    changeAvatar = async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "No file is uploaded",
                data: {}
            });
        }
        let avatar = `/images/avatar/${req.file.filename}`;
        let oldPath = req.session.user.avtImage;
        if (!oldPath) {
            // fs.unlinkSync(`./src/public${req.session.user.avatar}`);
            await userModel.updateOne({ _id: req.session.user._id }, { avtImage: avatar }).then(() => {
                req.session.user.avtImage = avatar;
                return res.json({
                    status: true,
                    message: "Change avatar successfully",
                    data: { }
                });
            })
        } else {
            // fs.unlinkSync(`./src/public${req.session.user.avatar}`);
            await userModel.updateOne({ _id: req.session.user._id }, { avtImage: avatar }).then(() => {
                req.session.user.avtImage = avatar;
                return res.json({
                    status: true,
                    message: "Change avatar successfully",
                    data: { }
                });
            })
        }
    }


    // [POST] /employee/p/update
    passC = async (req, res) => {
        try {
            const {username, oldPass, newPass, reNewPass} = req.body;
            const userCheck = await userModel.findOne({ username: username });

            if (!(await bcrypt.compare(oldPass, userCheck.password))) {
                return res.json({
                    status: false,
                    message: "Incorrect password",
                    data: {},
                });
            }

            const hashedPassword = await bcrypt.hash(newPass, 10);
            await userModel.updateOne({ username: username }, { password: hashedPassword }).then(() => {
                userModel.updateOne({ username: username }, { isConfirmed: true}).then(() => {
                    // logout
                    req.session.destroy();
                    return res.json({
                        status: true,
                        message: "Change password successfully",
                        data: {},
                    });
                })  
            })

        } catch (error) {
            console.log(error);
        }
    }


    // [GET] /employee/avt/update
    avtUpdate = async (req, res) => {
        res.render('pages/changeAvatar.hbs');
    }

    // [POST] /employee/avt/update
    avtC = async (req, res) => {
    }
}

module.exports = new EmployeesController();