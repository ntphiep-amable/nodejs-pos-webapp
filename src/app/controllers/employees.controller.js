const userModel = require("../models/users.model");
const bcrypt = require('bcrypt');


class EmployeesController {
    // [GET] /employees
    index = async (req, res) => {
        res.render('pages/employee.home.hbs');
    };

    // [POST] /employees
    handle = async (req, res) => {
        
    }
}

module.exports = new EmployeesController();