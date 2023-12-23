const userModel = require("../models/users.model");
const orderModel = require("../models/orders.model");
const customerModel = require("../models/customers.model");
const productModel = require("../models/products.model");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');


function generateToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

const sendEmail = (recipientEmail, name) => {
    const _linkData = `href="http://localhost:3000/admin/extra/c?token=${generateToken(recipientEmail)}" data-saferedirecturl="http://localhost:3000/admin/extra/c?token=${generateToken(recipientEmail)}"`;
    const html = fs.readFileSync(path.join(__dirname, '../../public/gmail.html'), 'utf8').replace('${_name}', name).replace('${_linkData}', _linkData);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nodejsadmtest@gmail.com',
            pass: 'mkrz svbx fekp dqyz',
        },
    });

    const mailOptions = {
        from: 'Digital World Assistant <nodejsadmtest@gmail.com>',
        to: recipientEmail,
        subject: 'Set up your DWA account!',
        html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};





class AdminController {
    // [GET]  /admin
    index = async (req, res) => {
        let employeeList = await userModel.find( {role: 'employee'} );
        let empls = employeeList.map(empl => {
            let emplObj = empl.toObject();
            return emplObj;
        });
        
        res.render('pages/admin.home.hbs', { employeeList: empls, name: req.session.user.fullname, isAdm: true, navActive: 'home' });
    };


    // [POST] /admin            // add employee
    addEmpl = async (req, res) => {
        try {
            const {fullname, email} = req.body;

            let username = email.split('@')[0];
            let password = email.split('@')[0];

            const emailCheck = await userModel.findOne({ email: email });
            if (emailCheck) {
                return res.json({
                    msg: 'Email already exists',
                    status: false
                });
            }

            // send onfirmation email to new employee
            await sendEmail(email, fullname);
            
            // add new employee to db
            const hashedPassword = await bcrypt.hash(password, 10);
            userModel.create({
                fullname: fullname,
                username: username,
                email: email,
                password: hashedPassword,
                role: 'employee',
                avtImage: '',

                isConfirmed: false,
                isActive: false,
                isLocked: false,
                
                emailConfirmed: false,
                token: generateToken(email),
                startTime: new Date().getTime(),
            });


            return res.json({
                status: true,
                data: { fullname, email }
            });

        } catch (error) {
            console.log(error);
        }
    };


    // [GET] /admin/extra/:c
    extra = async (req, res) => {
        const userCheck = await userModel.findOne({ token: req.query.token });

        if (userCheck) {
            if (new Date().getTime() - userCheck.startTime <= 60000) {
                userModel.updateOne({ email: userCheck.email }, { emailConfirmed: true }).then(() => {
                    console.log(userCheck.emailConfirmed);
                });
                req.session.token = req.query.token;
            } else {
                userModel.updateOne({ email: userCheck.email }, { emailConfirmed: false }).then(() => {
                    console.log(userCheck.emailConfirmed);
                });
            }
            req.session.isValidate = true;
        }
        res.redirect('/employee/set-password');
    }

    // [GET] /admin/products
    productList = async (req, res) => {
        res.render('pages/admin.products.hbs');
    }

    // [GET] /admin/stat
    stat = async (req, res) => {
        let orderList = await orderModel.find().sort({ createdAt: -1 });
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
        // 4 fields: Total amount received, Number of orders, number of products sold, total profit: product.retailPrice - product.importPrice
        const sumaryOrders = async (orders) => {
            return orders.reduce(async (sumaryPromise, order) => {
                let sumary = await sumaryPromise;
                sumary.totalAmount += order.totalAll;
                sumary.numberOfOrders += 1;
                sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                let productProfits = await Promise.all(order.products.map(async (product) => {
                    const prd = await productModel.findById(product.productId);
                    let profit = (parseFloat(prd.retailPrice) - parseFloat(prd.importPrice)) * parseInt(product.quantity);
                    return parseFloat(profit);
                }));
                sumary.totalProfit += productProfits.reduce((total, profit) => total + profit, 0);
                return sumary;
            }, Promise.resolve({ totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0, totalProfit: 0 }));
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
        let sumaryToday = await sumaryOrders(ordersToday);
        let sumaryYesterday = await sumaryOrders(ordersYesterday);
        let sumaryWithinLast7Days = await sumaryOrders(ordersWithinLast7Days);
        let sumaryThisMonth = await sumaryOrders(ordersThisMonth);
        res.render('pages/admin.stat.hbs', { orderList: orders, navActive: 'stat',  isAdm: true,
                        ordersToday, sumaryToday, ordersYesterday, sumaryYesterday, 
                        ordersWithinLast7Days, sumaryWithinLast7Days, ordersThisMonth, sumaryThisMonth });
    }
    // [POST] /admin/stat
    chooseStat = async (req, res) => {
        let { from, to } = req.body;
        let orderList = await orderModel.find().sort({ createdAt: -1 });
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
        const sumaryOrders = async (orders) => {
            return orders.reduce(async (sumaryPromise, order) => {
                let sumary = await sumaryPromise;
                sumary.totalAmount += order.totalAll;
                sumary.numberOfOrders += 1;
                sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                let productProfits = await Promise.all(order.products.map(async (product) => {
                    const prd = await productModel.findById(product.productId);
                    let profit = (parseFloat(prd.retailPrice) - parseFloat(prd.importPrice)) * parseInt(product.quantity);
                    return parseFloat(profit);
                }));
                sumary.totalProfit += productProfits.reduce((total, profit) => total + profit, 0);
                return sumary;
            }, Promise.resolve({ totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0, totalProfit: 0 }));
        }
        let sumaryInTime = await sumaryOrders(ordersInTime);
        res.status(200).json({ ordersInTime, sumaryInTime });
    };

    // [GET] /admin/stat/:email
    statEmpl = async (req, res) => {
        // get all orders created from 0:00:00 to 23:59:59 today
        let user = await userModel.findOne({ email: req.params.email });
        if (!user) {
            res.status(404).json({
                status: false,
                message: "Not found"
            });
        }
        let orderList = await orderModel.find({ createdBy: user._id}).sort({ createdAt: -1 });
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
        const sumaryOrders = async (orders) => {
            return orders.reduce(async (sumaryPromise, order) => {
                let sumary = await sumaryPromise;
                sumary.totalAmount += order.totalAll;
                sumary.numberOfOrders += 1;
                sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                let productProfits = await Promise.all(order.products.map(async (product) => {
                    const prd = await productModel.findById(product.productId);
                    let profit = (parseFloat(prd.retailPrice) - parseFloat(prd.importPrice)) * parseInt(product.quantity);
                    return parseFloat(profit);
                }));
                sumary.totalProfit += productProfits.reduce((total, profit) => total + profit, 0);
                return sumary;
            }, Promise.resolve({ totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0, totalProfit: 0 }));
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
        let sumaryToday = await sumaryOrders(ordersToday);
        let sumaryYesterday = await sumaryOrders(ordersYesterday);
        let sumaryWithinLast7Days = await sumaryOrders(ordersWithinLast7Days);
        let sumaryThisMonth = await sumaryOrders(ordersThisMonth);
        res.render('pages/admin.stat.hbs', { orderList: orders, navActive: 'stat',  isAdm: true, employee: user.fullname,
                        ordersToday, sumaryToday, ordersYesterday, sumaryYesterday, 
                        ordersWithinLast7Days, sumaryWithinLast7Days, ordersThisMonth, sumaryThisMonth });
    };

    // [POST] /employee/stat/:email
    chooseStatEmpl = async (req, res) => {
        let { from, to } = req.body;
        let user = await userModel.findOne({ email: req.params.email });
        if (!user) {
            res.status(404).json({
                status: false,
                message: "Not found"
            });
        }
        let orderList = await orderModel.find({ createdBy: user._id}).sort({ createdAt: -1 });
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
        const sumaryOrders = async (orders) => {
            return orders.reduce(async (sumaryPromise, order) => {
                let sumary = await sumaryPromise;
                sumary.totalAmount += order.totalAll;
                sumary.numberOfOrders += 1;
                sumary.numberOfProducts += order.products.reduce((sum, product) => {
                    return sum + product.quantity;
                }, 0);
                let productProfits = await Promise.all(order.products.map(async (product) => {
                    const prd = await productModel.findById(product.productId);
                    let profit = (parseFloat(prd.retailPrice) - parseFloat(prd.importPrice)) * parseInt(product.quantity);
                    return parseFloat(profit);
                }));
                sumary.totalProfit += productProfits.reduce((total, profit) => total + profit, 0);
                return sumary;
            }, Promise.resolve({ totalAmount: 0, numberOfOrders: 0, numberOfProducts: 0, totalProfit: 0 }));
        }
        let sumaryInTime = await sumaryOrders(ordersInTime);
        res.status(200).json({ ordersInTime, sumaryInTime });
    };

    // [GET] /admin/p/update
    passUpdate = async (req, res) => {
        res.render('pages/changePass.hbs', { isAdm: true, username: req.session.user.username  });
    }

    // [POST] /admin/p/update
    passC = async (req, res) => {
        try {
            const {username, oldPass, newPass, reNewPass} = req.body;
            const userCheck = await userModel.findOne({ username: username });

            if (!(await bcrypt.compare(oldPass, userCheck.password))) {
                return res.json({
                    status: false,
                    message: "Old password is incorrect",
                    data: {},
                });
            }

            else if (oldPass === newPass) {
                return res.json({
                    status: false,
                    message: "New password must be different from old password",
                    data: {},
                });
            }

            else if (newPass !== reNewPass) {
                return res.json({
                    status: false,
                    message: "New password and retype new password must be the same",
                    data: {},
                });
            };

            const hashedPassword = await bcrypt.hash(newPass, 10);
            await userModel.updateOne({ username: username }, { password: hashedPassword }).then(() => {
                // logout
                req.session.destroy();
                return res.json({
                    status: true,
                    message: "Change password successfully",
                    data: {},
                });
            });

        } catch (error) {
            console.log(error)
        }
    }



    // [GET] /admin/e/:m
    detailEmpl = async (req, res) => {
        const empl = await userModel.findOne({ email: req.query.m });

        res.render('pages/detail.employee.hbs', { fullname: empl.fullname, isLocked: empl.isLocked, email: empl.email, isAdm: true, navActive: 'home'});
    }


    // [POST] /admin/l/employee
    lockEmpl = async (req, res) => {
        const userCheck = await userModel.findOne({ email: req.body.mail });
        if (!userCheck.isLocked) {
            await userModel.updateOne({ email: req.body.mail }, { isLocked: true }).then(() => {
                const isLocked = userCheck.isLocked;
                return res.json({
                    status: true,
                    message: `Lock employee ${userCheck.fullname} successfully`,
                    data: { isLocked }
                })
            });

        } else {
            await userModel.updateOne({ email: req.body.mail }, { isLocked: false }).then(() => {
                const isLocked = userCheck.isLocked;
                return res.json({
                    status: true,
                    message: `Unlock employee ${userCheck.fullname} successfully`,
                    data: { isLocked }
                })
            });
        }

    }


    // [POST] /admin/send/employee
    sendMail = async (req, res) => {
        try {
            const account = await userModel.findOne({ email: req.body.mail });
            const fullname = account.fullname;
            await userModel.updateOne({ email: req.body.mail }, { startTime: new Date().getTime() }).then(() => {                
                sendEmail(req.body.mail, fullname);

                return res.json({
                    status: true,
                    message: "Send email successfully",
                    data: { }
                })
            })

        } catch (error) {
            console.log(error);
            return res.json({
                status: false,
                message: "Send email failed, please check again",
                data: {  }
            });
        }        
    }

    // [GET] /admin/account
    account = async (req, res) => {
        res.render('pages/account.hbs', { navActive: 'account', user: req.session.user, isAdm: true });
    }

    // [GET] /admin/account/:email
    detailAccount = async (req, res) => {
        const user = await userModel.findOne({ email: req.params.email });
        const userObj = user.toObject();
        res.render('pages/account.hbs', { navActive: 'account', user: userObj, viewOnly: true, isAdm: true });
    }
        
    // [POST] /admin/changeAvatar
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
}

module.exports = new AdminController();