const loginRouter = require('./login.route');
const adminRouter = require('./admin.route');
const employeesRouter = require('./employees.route');



const route = (app) => {
    app.use('/login', loginRouter);
    app.use('/admin', adminRouter);
    app.use('/employee', employeesRouter);


    app.get('/', (req, res) => {
        // res.send('kkk');
        res.render('pages/home.hbs');
    });
};


module.exports = route;