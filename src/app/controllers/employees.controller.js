const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');


class EmployeesController {
    // [GET] /employee
    index = async (req, res) => {
        res.render('pages/employee.home.hbs');  
    };

    // [POST] /employee
    handle = async (req, res) => {
        
    }


    // [POST] /employee/c
    checkNew = async (req, res) => {
        try {
            const data = req.body.username;
            console.log(data);
            console.log("kqnc");

            const userCheck = await userModel.findOne({ username: req.body.username });
            if (!userCheck.isConfirmed) {
                return res.json({
                    status: false,
                    message: "bạn là nhân viên mới, vui lòng đổi mật khẩu",
                    data: { }
                }) 
            }

            else if (userCheck.isLocked) {
                return res.json({
                    status: false,
                    message: "bạn đã bị admin khóa mõm",
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
        res.render('pages/changePass.hbs');
    }


    // [POST] /employee/p/update
    passC = async (req, res) => {
        try {
            const {username, oldPass, newPass, reNewPass} = req.body;
            const userCheck = await userModel.findOne({ username: username });
            console.log(oldPass);
            console.log(userCheck.fullname);


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
                userModel.updateOne({ username: username }, { isConfirmed: true}).then(() => {
                    return res.json({
                        status: true,
                        message: "đã đổi pass",
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
        console.log("doi anh");
    }
}

module.exports = new EmployeesController();