const usersModel = require('../models/users.model');
const bcrypt = require("bcrypt");

class RegisterController {
    // [GET] /register
    index = (req, res) => {
      res.render('pages/register.hbs');
    };
  
    // [POST] /register
    save = async (req, res, next) => {
      try {
        const {fullname, email, password} = req.body;
      
        // check email
        const emailCheck = await usersModel.findOne({ email });
        if (emailCheck) return res.json({ msg: "Email đã tồn tại", status: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const User = usersModel.create({
          fullname,
          email,
          password: hashedPassword,
          role: 'admin',
        });

        delete (await User).password;
        // return res.json({ msg: "Đăng kí thành công", status: true, User });
        alert("đăng kí thành công");
        res.redirect('/login');
      } catch (err) {
        next(err);
      }
    }
  }
  
  module.exports = new RegisterController();
  