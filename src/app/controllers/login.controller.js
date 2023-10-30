const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');


class LoginController {
    // [GET] /login
    index = async (req, res) => {
        res.render('pages/login.hbs');

        // add root administrator (admin/admin)
        const adminCheck = await userModel.find({ username: 'admin' });
        if (adminCheck.length === 0) {

            userModel.create({
                fullname: 'Nguyen Van Admin',
                username: 'admin',
                email: 'admin@gmail.com',
                password: await bcrypt.hash('admin', 10),
                role: 'admin',
                avtImage: '',

                isConfirmed: true,
                isActive: true,
                isLocked: false,
                
                emailConfirmed: true,
                token: '',
                startTime: 0,
            });

            userModel.create({
                fullname: 'Nguyen Hiep',
                username: 'deptrai',
                email: 'deptrai@gmail.com',
                password: await bcrypt.hash('nguyenhiep', 10),
                role: 'admin',
                avtImage: '',

                isConfirmed: true,
                isActive: true,
                isLocked: false,
                
                emailConfirmed: true,
                token: '',
                startTime: 0,
            });
        }
    };


    // [POST] /login
    check = async (req, res) => {
        try {
            const {username, password} = req.body;

            console.log(req.body);

            const userCheck = await userModel.findOne({ username: username });
            if (!userCheck) {
                console.log('sai username');
                return res.json({
                    status: false,
                    message: "username sai",
                    data: {},
                });
            };

            const isPasswordValid = await bcrypt.compare(password, userCheck.password);
            if (!isPasswordValid) {
                console.log('sai pass');
                return res.json({
                    status: false,
                    message: "pass sai",
                    data: {},
                })
            };

            // role check
            if (userCheck.role === 'admin') {
                console.log('dung la admin roi');
                const fullname = userCheck.fullname;
                const role = userCheck.role;
                return res.json({
                    status: true,
                    role: 'admin',
                    data: {fullname, username, role}
                })
            } else {
                console.log('nhan vien quen');
                
                // check if login with link in email
                if (userCheck.emailConfirmed ) {
                    console.log('ok employee');
                    const fullname = userCheck.fullname;
                    const role = userCheck.role;
                    return res.json({
                        status: true,
                        role: 'employee',
                        data: {fullname, username, role}
                    });

                } else {
                    return res.json({
                        status: false,
                        message: "mày là nhân viên mới thì login bằng cái link trong email ấy!",
                        data: {}
                    })
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new LoginController();