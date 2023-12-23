const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const app = express();
const port = 3000;
const route = require('./routes/index');
const db = require('./config/db');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt');

// ** HTTP logger **
app.use(morgan('tiny'));

// ** Session **
app.use(session({
  secret: 'secRet-KeY',
  resave: false,
  saveUninitialized: true,
}));

// ** Flash **
app.use(flash());

// ** Static files **
app.use(express.static(path.join(__dirname, 'public')));

// ** Template engine **
app.engine('.hbs', engine({ 
  extname: '.hbs',
  helpers: require('./utils/helpers')
 }));
app.set("view engine', '.hbs");
app.set('views', path.join(__dirname, 'resources', 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ** Connect to DB **
db.connect();

// ** router
route(app);






app.listen(port, () => {
  console.log(`The application is listening at http://localhost:${port}, press Ctrl+C to quit.`);
});
