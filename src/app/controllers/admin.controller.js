const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

const sendEmail = (recipientEmail, html) => {
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
            const token = generateToken(email);
            const html = `
            <h1>xin chào ${fullname}</h1>

            <b>bạn là nhân viên mới</b> <br>

            <a href="http://localhost:3000/admin/extra/c?token=${token}" data-saferedirecturl="http://localhost:3000/admin/extra/c?token=${token}">click zô để login (chỉ có hiệu lực 1 phút)</a>
            `


            await sendEmail(email, html);

            
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



            return res.json({
                status: true,
                data: { fullname, email }
            })

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

    // [GET] /admin/e/:m
    detailEmpl = async (req, res) => {
        const empl = await userModel.findOne({ email: req.query.m });
        console.log(empl.fullname);

        res.render('pages/detail.employee.hbs', { fullname: empl.fullname });
    }
}

module.exports = new AdminController();