const loginRouter = require('./login.route');
const adminRouter = require('./admin.route');




const route = (app) => {
    app.use('/login', loginRouter);
    app.use('/admin', adminRouter);


    app.get('/', (req, res) => {
        // res.send('kkk');
        res.render('pages/hello.hbs');
    });
};


module.exports = route;