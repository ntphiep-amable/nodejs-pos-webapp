const productsRouter = require('./products.route');
const userRouter = require('./user.route');
const loginRouter = require('./login.route');
const registerRouter = require('./register.route');
const adminRouter = require('./admin.route');
const employeesRouter = require('./employees.route');

const route = (app) => {
  app.use('/products', productsRouter);
  app.use('/user', userRouter);
  app.use('/login', loginRouter);
  app.use('/register', registerRouter);
  app.use('/admin', adminRouter);
  app.use('/employees', employeesRouter);

  app.get('/', (req, res) => {
    res.render('pages/home.hbs');
  });
};

module.exports = route;
