const userModel = require('../models/users.model');
const bycrypt = require("bcrypt");

class UserController {
  index(req, res) {
    res.send('oke');
  }

  async detail(req, res) {
    try {
      const emailUser = req.params.email;
      const myUser = await userModel.find({ email: emailUser }).exec();
      res.render('pages/user.hbs', { myUser: myUser[0] });
    } catch (error) {
      res.send("User not found");
    }
  }
}

module.exports = new UserController();
