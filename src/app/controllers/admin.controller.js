const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

const sendEmail = (recipientEmail, name) => {
    const html = `
    <h1>xin chào ${name}</h1>

    <b>bạn là nhân viên mới</b> <br>

    <a href="http://localhost:3000/admin/extra/c?token=${generateToken(recipientEmail)}" data-saferedirecturl="http://localhost:3000/admin/extra/c?token=${generateToken(recipientEmail)}">click zô để login (chỉ có hiệu lực 1 phút)</a>
    `

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
        from: 'nodejsadmtest@gmail.com',
        to: recipientEmail,
        subject: 'Subject of your email',
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

        console.log();
        res.render('pages/admin.home.hbs', { employeeList: empls });
    };


    // [POST] /admin
    addEmpl = async (req, res) => {
        try {
            const {fullname, email} = req.body;
            console.log(req.body);

            let username = email.split('@')[0];
            let password = email.split('@')[0];

            const emailCheck = await userModel.findOne({ email: email });
            if (emailCheck) {
                return res.json({
                    msg: 'email đã tồn tại',
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
                token: token,
                startTime: new Date().getTime(),
            });


            console.log("doi pass");


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
            if (new Date().getTime() - userCheck.startTime <= 120000) {
                userModel.updateOne({ email: userCheck.email }, { emailConfirmed: true }).then(() => {
                    console.log('còn cứu');
                    console.log(userCheck.emailConfirmed);
                });
                
                res.redirect('/login');
            } else {
                userModel.updateOne({ email: userCheck.email }, { emailConfirmed: false }).then(() => {
                    console.log(userCheck.emailConfirmed);
                });
                
                res.render('pages/extrapage.hbs');
            }
        }
    }


    // [GET] /admin/products
    productList = async (req, res) => {
        res.render('pages/admin.products.hbs');
    }

    // [GET] /admin/stat
    stat = async (req, res) => {
        res.render('pages/admin.stat.hbs');
    }

    // [GET] /admin/p/update
    passUpdate = async (req, res) => {
        res.render('pages/changePass.hbs');
    }

    // [POST] /admin/p/update
    passC = async (req, res) => {
        try {
            const {username, oldPass, newPass, reNewPass} = req.body;
            const userCheck = await userModel.findOne({ username: username });
            console.log(oldPass);

            if (!(await bcrypt.compare(oldPass, userCheck.password))) {
                return res.json({
                    status: false,
                    message: "sai pass cũ",
                    data: {},
                });
            }

            else if (oldPass === newPass) {
                return res.json({
                    status: false,
                    message: "pass cũ và mới phải khác nhau",
                    data: {},
                });
            }

            else if (newPass !== reNewPass) {
                return res.json({
                    status: false,
                    message: "nhập lại pass đúng",
                    data: {},
                });
            };

            const hashedPassword = await bcrypt.hash(newPass, 10);
            await userModel.updateOne({ username: username }, { password: hashedPassword }).then(() => {
                return res.json({
                    status: true,
                    message: "đã đổi pass",
                    data: {},
                });
            })

        } catch (error) {
            console.log(error)
        }
    }



    // [GET] /admin/e/:m
    detailEmpl = async (req, res) => {
        const empl = await userModel.findOne({ email: req.query.m });
        console.log(req.query.m);
        console.log(empl.fullname);

        const btnMes = empl.isLocked ? "mở khóa" : "khóa mỗm";

        res.render('pages/detail.employee.hbs', { fullname: empl.fullname, isLocked: empl.isLocked, email: empl.email, btnMes:btnMes});
    }


    // [POST] /admin/l/employee
    lockEmpl = async (req, res) => {
        const userCheck = await userModel.findOne({ email: req.body.mail });
        if (!userCheck.isLocked) {
            await userModel.updateOne({ email: req.body.mail }, { isLocked: true }).then(() => {
                const isLocked = userCheck.isLocked;
                console.log('ok');
                console.log(isLocked);
                
                return res.json({
                    status: true,
                    message: "thực hiện thành công",
                    data: { isLocked }
                })
            });

        } else {
            await userModel.updateOne({ email: req.body.mail }, { isLocked: false }).then(() => {
                const isLocked = userCheck.isLocked;
                console.log('ok');
                console.log(isLocked);
                
                return res.json({
                    status: true,
                    message: "thực hiện thành công",
                    data: { isLocked }
                })
            });
        }

    }


    // [POST] /admin/send/employee
    sendMail = async (req, res) => {
        try {
            const fullname = await userModel.findOne({ email: req.body.mail }).fullname;
            await userModel.updateOne({ email: req.body.mail }, { startTime: new Date().getTime() }).then(() => {                
                sendEmail(req.body.mail, fullname);

                return res.json({
                    status: true,
                    message: "gửi mail thành công",
                    data: { }
                })
            })

        } catch (error) {
            console.log(error);
            return res.json({
                status: false,
                message: "k gửi đc",
                data: {  }
            });
        }        
    }
        
    
}

module.exports = new AdminController();