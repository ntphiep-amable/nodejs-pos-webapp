const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');


class LoginController {
    // [GET] /login
    index = async (req, res) => {
        if (req.session.user) {
            if (req.session.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/employee');
            }
        }
        res.render('pages/login.hbs', { sflash: req.flash('error') });

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
                isActive: false,
                isLocked: false,
                
                emailConfirmed: true,
                token: '',
                startTime: 0,
            });

            userModel.create({
                fullname: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@email.com',
                password: await bcrypt.hash('johndoe', 10),
                role: 'employee',
                avtImage: '',

                isConfirmed: true,
                isActive: false,
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

            const userCheck = await userModel.findOne({ username: username });
            if (!userCheck) {
                req.flash('error', 'Incorrect username or password!');
                return res.redirect('/login');
            };

            const isPasswordValid = await bcrypt.compare(password, userCheck.password);
            if (!isPasswordValid) {
                // console.log('Incorrect password!');
                req.flash('error', 'Incorrect username or password!');
                return res.redirect('/login');
            };
            
            if (userCheck.isLocked) {
                req.flash('error', 'Your account has been locked! Please contact the administrator for more information.');
                return res.redirect('/login');
            }

            // role check
            if (userCheck.role === 'admin') {
                // console.log('Welcome administator!!!');
                // const fullname = userCheck.fullname;
                // const role = userCheck.role;
                // update isActive = true
                await userModel.updateOne({ 
                    _id: userCheck._id
                }, { isActive: true });
                req.session.user = userCheck;
                req.session.role = 'admin';
                return res.redirect('/admin');
            } else {
                // console.log('Welcome employee!!!');
                
                // check if login with link in email
                if (userCheck.emailConfirmed ) {
                    // console.log('Email confirmed');
                    const fullname = userCheck.fullname;
                    const role = userCheck.role;
                    // update isActive = true
                    await userModel.updateOne({ 
                        _id: userCheck._id
                    }, { isActive: true });
                    req.session.user = userCheck;
                    req.session.role = 'employee';
                    return res.redirect('/employee');
                    // return res.json({
                    //     status: true,
                    //     role: 'employee',
                    //     data: {fullname, username, role}
                    // });

                } else {
                    req.flash('error', 'Please login by clicking on the link in your email!');
                    return res.redirect('/login');
                    // return res.json({
                    //     status: false,
                    //     message: "You have not confirmed your email yet!",
                    //     data: {}
                    // })
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // [DELETE] /login
    logout = async (req, res) => {
        await userModel.updateOne({ _id: req.session.user._id }, { isActive: false });
        req.session.destroy();
        res.status(204).json({
            status: true,
            message: "Logout successfully!",
            data: {}
        });
    }
}


module.exports = new LoginController();